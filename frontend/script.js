console.log("Front-end carregado. Aguardando interação do usuário.");

document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const uploadNav = document.getElementById('upload-nav');
    const historyNav = document.getElementById('history-nav');
    const dashboardNav = document.getElementById('dashboard-nav');
    const uploadSection = document.getElementById('upload-section');
    const resultsSection = document.getElementById('results-section');
    const historySection = document.getElementById('history-section');
    const dashboardSection = document.getElementById('dashboard-section');
    
    // Show upload section by default
    uploadSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    historySection.classList.add('hidden');
    
    // Verificar se o dashboard existe
    if (dashboardSection) {
        dashboardSection.classList.add('hidden');
    }
    
    // Navigation event listeners
    if (uploadNav) {
        uploadNav.addEventListener('click', function() {
            uploadSection.classList.remove('hidden');
            resultsSection.classList.add('hidden');
            historySection.classList.add('hidden');
            if (dashboardSection) dashboardSection.classList.add('hidden');
            
            uploadNav.classList.add('bg-white', 'text-blue-700');
            uploadNav.classList.remove('bg-transparent');
            historyNav.classList.remove('bg-white', 'text-blue-700');
            historyNav.classList.add('bg-transparent');
            if (dashboardNav) {
                dashboardNav.classList.remove('bg-white', 'text-blue-700');
                dashboardNav.classList.add('bg-transparent');
            }
        });
    }
    
    if (historyNav) {
        historyNav.addEventListener('click', function() {
            uploadSection.classList.add('hidden');
            resultsSection.classList.add('hidden');
            historySection.classList.remove('hidden');
            if (dashboardSection) dashboardSection.classList.add('hidden');
            
            historyNav.classList.add('bg-white', 'text-blue-700');
            historyNav.classList.remove('bg-transparent');
            uploadNav.classList.remove('bg-white', 'text-blue-700');
            uploadNav.classList.add('bg-transparent');
            if (dashboardNav) {
                dashboardNav.classList.remove('bg-white', 'text-blue-700');
                dashboardNav.classList.add('bg-transparent');
            }
            
            loadHistory();
        });
    }
    
    if (dashboardNav) {
        dashboardNav.addEventListener('click', function() {
            uploadSection.classList.add('hidden');
            resultsSection.classList.add('hidden');
            historySection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            
            dashboardNav.classList.add('bg-white', 'text-blue-700');
            dashboardNav.classList.remove('bg-transparent');
            uploadNav.classList.remove('bg-white', 'text-blue-700');
            uploadNav.classList.add('bg-transparent');
            historyNav.classList.remove('bg-white', 'text-blue-700');
            historyNav.classList.add('bg-transparent');
            
            loadMetrics();
        });
    }
    
    // Upload functionality
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('csv-upload');
    const uploadStatus = document.getElementById('upload-status');
    
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function() {
            if (!fileInput.files.length) {
                showNotification('Por favor, selecione um arquivo CSV.', 'error');
                return;
            }
            
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
            
            // Show loading status
            if (uploadStatus) {
                uploadStatus.classList.remove('hidden');
            }
            uploadBtn.disabled = true;
            
            fetch('http://127.0.0.1:8000/upload-csv/', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Dados recebidos:', data);
                
                // Hide loading status
                if (uploadStatus) {
                    uploadStatus.classList.add('hidden');
                }
                uploadBtn.disabled = false;
                
                if (data.error) {
                    showNotification('Erro: ' + data.error, 'error');
                    return;
                }
                
                // Show results section
                uploadSection.classList.add('hidden');
                resultsSection.classList.remove('hidden');
                
                // Render charts
                renderHiddenProfitChart(data.hidden_profit);
                renderPriceSuggestionsChart(data.price_suggestions);
                
                // Atualizar métricas após upload bem-sucedido
                loadMetrics();
                
                showNotification('Análise concluída com sucesso!', 'success');
            })
            .catch(error => {
                console.error('Erro:', error);
                showNotification('Erro ao processar o arquivo. Verifique o console para mais detalhes.', 'error');
                
                // Hide loading status
                if (uploadStatus) {
                    uploadStatus.classList.add('hidden');
                }
                uploadBtn.disabled = false;
            });
        });
    }
    
    // Verificar se o input de arquivo direto existe
    const directFileInput = document.getElementById('csv-upload');
    if (directFileInput && !uploadBtn) {
        directFileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const formData = new FormData();
            formData.append("file", file);
            
            try {
                showUploadStatus(true, "Processando arquivo...");
                
                const response = await fetch("http://127.0.0.1:8000/upload-csv/", {
                    method: "POST",
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.error) {
                    showUploadStatus(false, result.error);
                    return;
                }
                
                showUploadStatus(true, "Arquivo processado com sucesso!");
                
                // Atualizar gráficos
                updateCharts(result);
                
                // Atualizar métricas e histórico
                loadMetrics();
                loadHistory();
            } catch (error) {
                showUploadStatus(false, "Erro ao processar o arquivo. Tente novamente.");
                console.error("Erro:", error);
            }
        });
    }
    
    // Função para atualizar os gráficos
    function updateCharts(data) {
        // Lucro Escondido
        const profitLabels = data.hidden_profit.map(item => item.produto);
        const margins = data.hidden_profit.map(item => item.margem);
        
        const profitCtx = document.getElementById("hidden-profit-chart");
        if (profitCtx) {
            const ctx = profitCtx.getContext("2d");
            if (window.profitChart) {
                window.profitChart.destroy();
            }
            
            window.profitChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: profitLabels,
                    datasets: [{ 
                        label: "Margem (%)", 
                        data: margins, 
                        backgroundColor: chartColors.profit.background,
                        borderColor: chartColors.profit.border,
                        borderWidth: 1,
                        borderRadius: 6
                    }]
                },
                options: { 
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Margem de Lucro por Produto'
                        }
                    },
                    scales: { 
                        y: { 
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        } 
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
        
        // Mentor de Preços
        const priceLabels = data.price_suggestions.map(item => item.produto);
        const prices = data.price_suggestions.map(item => item.preco_sugerido);
        
        const priceCtx = document.getElementById("price-suggestions-chart");
        if (priceCtx) {
            const ctx = priceCtx.getContext("2d");
            if (window.priceChart) {
                window.priceChart.destroy();
            }
            
            window.priceChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: priceLabels,
                    datasets: [{ 
                        label: "Preço Sugerido (R$)", 
                        data: prices, 
                        backgroundColor: chartColors.price.background,
                        borderColor: chartColors.price.border,
                        borderWidth: 1,
                        borderRadius: 6
                    }]
                },
                options: { 
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Preços Sugeridos por Produto'
                        }
                    },
                    scales: { 
                        y: { 
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value;
                                }
                            }
                        } 
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
    }
    
    // Botão de atualizar métricas
    const refreshMetricsBtn = document.getElementById("refresh-metrics");
    if (refreshMetricsBtn) {
        refreshMetricsBtn.addEventListener("click", () => {
            const icon = refreshMetricsBtn.querySelector("i");
            
            // Adicionar classe de rotação ao ícone
            if (icon) {
                icon.classList.add("fa-spin");
            }
            
            // Desabilitar botão durante a atualização
            refreshMetricsBtn.disabled = true;
            
            // Carregar métricas e histórico
            Promise.all([loadMetrics(), loadHistory()])
                .finally(() => {
                    // Remover classe de rotação e habilitar botão após 1 segundo
                    setTimeout(() => {
                        if (icon) {
                            icon.classList.remove("fa-spin");
                        }
                        refreshMetricsBtn.disabled = false;
                    }, 1000);
                });
        });
    }
    
    // Load history and metrics on page load
    loadHistory();
    loadMetrics();
});

function renderHiddenProfitChart(hiddenProfit) {
    const ctx = document.getElementById('hidden-profit-chart').getContext('2d');
    
    // Clear previous chart if exists
    if (window.hiddenProfitChart) {
        window.hiddenProfitChart.destroy();
    }
    
    if (!hiddenProfit || hiddenProfit.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#6B7280';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhum produto com lucro escondido encontrado.', ctx.canvas.width / 2, 50);
        return;
    }
    
    const labels = hiddenProfit.map(item => item.produto);
    const margins = hiddenProfit.map(item => item.margem);
    
    window.hiddenProfitChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Margem (%)',
                data: margins,
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                borderColor: 'rgba(124, 58, 237, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Produtos com Lucro Escondido',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Margem: ${context.raw.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Margem (%)'
                    }
                }
            }
        }
    });
}

function renderPriceSuggestionsChart(suggestions) {
    const ctx = document.getElementById('price-suggestions-chart').getContext('2d');
    
    // Clear previous chart if exists
    if (window.priceSuggestionsChart) {
        window.priceSuggestionsChart.destroy();
    }
    
    if (!suggestions || suggestions.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#6B7280';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhuma sugestão de preço disponível.', ctx.canvas.width / 2, 50);
        return;
    }
    
    const labels = suggestions.map(item => item.produto);
    const currentPrices = suggestions.map(item => item.preco_atual);
    const suggestedPrices = suggestions.map(item => item.preco_sugerido);
    
    window.priceSuggestionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Preço Atual (R$)',
                    data: currentPrices,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Preço Sugerido (R$)',
                    data: suggestedPrices,
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Sugestões de Preços',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Preço (R$)'
                    }
                }
            }
        }
    });
}

async function loadHistory() {
    try {
        const historyTable = document.getElementById('history-table');
        
        const response = await fetch('http://127.0.0.1:8000/history/');
        const history = await response.json();
        
        if (!history || history.length === 0) {
            historyTable.innerHTML = `
                <div class="text-center py-10 text-gray-500">
                    <i class="fas fa-info-circle text-2xl mb-2"></i>
                    <p>Nenhum dado encontrado no histórico.</p>
                </div>
            `;
            return;
        }
        
        // Group by product to show the most recent entries
        const productMap = {};
        history.forEach(item => {
            productMap[item.produto] = item;
        });
        
        const uniqueProducts = Object.values(productMap);
        
        historyTable.innerHTML = `
            <table class="min-w-full bg-white border">
                <thead>
                    <tr class="bg-gray-100 text-gray-700">
                        <th class="py-3 px-4 border text-left">Produto</th>
                        <th class="py-3 px-4 border text-right">Preço (R$)</th>
                        <th class="py-3 px-4 border text-right">Quantidade</th>
                        <th class="py-3 px-4 border text-right">Custo (R$)</th>
                        <th class="py-3 px-4 border text-right">Lucro Est. (R$)</th>
                    </tr>
                </thead>
                <tbody>
                    ${uniqueProducts.map(item => {
                        const lucro = (item.preco * item.quantidade) - (item.custo * item.quantidade);
                        return `
                            <tr class="hover:bg-gray-50 transition">
                                <td class="py-3 px-4 border">${item.produto}</td>
                                <td class="py-3 px-4 border text-right">${item.preco.toFixed(2)}</td>
                                <td class="py-3 px-4 border text-right">${item.quantidade}</td>
                                <td class="py-3 px-4 border text-right">${item.custo.toFixed(2)}</td>
                                <td class="py-3 px-4 border text-right font-medium ${lucro > 0 ? 'text-green-600' : 'text-red-600'}">${lucro.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        document.getElementById('history-table').innerHTML = `
            <div class="text-center py-10 text-red-500">
                <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                <p>Erro ao carregar o histórico. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${
        type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
        type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
        'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="flex-shrink-0">
                <i class="fas ${
                    type === 'error' ? 'fa-exclamation-circle' :
                    type === 'success' ? 'fa-check-circle' :
                    'fa-info-circle'
                }"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <div class="ml-auto pl-3">
                <button class="inline-flex text-gray-400 hover:text-gray-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add click event to close button
    notification.querySelector('button').addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Configuração de cores para gráficos
const chartColors = {
    profit: {
        background: 'rgba(34, 197, 94, 0.2)',
        border: 'rgba(34, 197, 94, 1)'
    },
    price: {
        background: 'rgba(59, 130, 246, 0.2)',
        border: 'rgba(59, 130, 246, 1)'
    }
};

// Função para animação de contagem
function animateCounter(element, targetValue, prefix = '', suffix = '', duration = 1500) {
    if (!element) return;
    
    const startValue = 0;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;
    
    const formatValue = (value) => {
        return prefix + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace('.', ',') + suffix;
    };
    
    const updateCounter = () => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            element.textContent = formatValue(targetValue);
            return;
        }
        
        element.textContent = formatValue(currentValue);
        requestAnimationFrame(updateCounter);
    };
    
    updateCounter();
}

// Função para mostrar notificação de upload
function showUploadStatus(success, message) {
    const statusDiv = document.getElementById('upload-status');
    if (!statusDiv) return;
    
    statusDiv.classList.remove('hidden');
    
    if (success) {
        statusDiv.innerHTML = `
            <div class="flex items-center text-green-600">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
    } else {
        statusDiv.innerHTML = `
            <div class="flex items-center text-red-600">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
    }
    
    // Esconder após 5 segundos
    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 5000);
}

// Função para carregar métricas
async function loadMetrics() {
    try {
        const response = await fetch("http://127.0.0.1:8000/metrics/");
        const metrics = await response.json();
        
        console.log("Métricas carregadas:", metrics);

        // Verificar se os elementos existem antes de atualizar
        const totalRevenueElement = document.getElementById("total-revenue");
        const totalProfitElement = document.getElementById("total-profit");
        const avgMarginElement = document.getElementById("avg-margin");
        const topProductElement = document.getElementById("top-product");
        
        if (metrics.error) {
            if (totalRevenueElement) totalRevenueElement.textContent = "R$ 0,00";
            if (totalProfitElement) totalProfitElement.textContent = "R$ 0,00";
            if (avgMarginElement) avgMarginElement.textContent = "0%";
            if (topProductElement) topProductElement.textContent = "N/A";
            return;
        }

        // Animar contadores se os elementos existirem
        if (totalRevenueElement) {
            animateCounter(
                totalRevenueElement, 
                metrics.total_revenue, 
                'R$ '
            );
        }
        
        if (totalProfitElement) {
            animateCounter(
                totalProfitElement, 
                metrics.total_profit, 
                'R$ '
            );
        }
        
        if (avgMarginElement) {
            animateCounter(
                avgMarginElement, 
                metrics.average_margin, 
                '', 
                '%'
            );
        }
        
        // Atualizar produto top com efeito de pulse
        if (topProductElement) {
            topProductElement.textContent = metrics.top_product;
            topProductElement.classList.add('pulse');
            setTimeout(() => {
                topProductElement.classList.remove('pulse');
            }, 2000);
        }
        
    } catch (error) {
        console.error("Erro ao carregar métricas:", error);
    }
}

// Carregar métricas e histórico ao iniciar
document.addEventListener("DOMContentLoaded", () => {
    loadMetrics();
    loadHistory();
}); 