console.log("Front-end carregado. Aguardando lógica de upload.");

document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('csv-upload');
    
    uploadBtn.addEventListener('click', function() {
        if (!fileInput.files.length) {
            alert('Por favor, selecione um arquivo CSV.');
            return;
        }
        
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        // Mostrar mensagem de carregamento
        uploadBtn.textContent = 'Analisando...';
        uploadBtn.disabled = true;
        
        fetch('http://127.0.0.1:8000/upload-csv/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos:', data);
            
            // Restaurar botão
            uploadBtn.textContent = 'Analisar Dados';
            uploadBtn.disabled = false;
            
            if (data.error) {
                alert('Erro: ' + data.error);
                return;
            }
            
            // Renderizar gráficos
            renderHiddenProfitChart(data.hidden_profit);
            renderPriceSuggestionsChart(data.price_suggestions);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao processar o arquivo. Verifique o console para mais detalhes.');
            
            // Restaurar botão
            uploadBtn.textContent = 'Analisar Dados';
            uploadBtn.disabled = false;
        });
    });
});

function renderHiddenProfitChart(hiddenProfit) {
    const ctx = document.getElementById('hidden-profit-chart').getContext('2d');
    
    // Limpar gráfico anterior se existir
    if (window.hiddenProfitChart) {
        window.hiddenProfitChart.destroy();
    }
    
    if (!hiddenProfit || hiddenProfit.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillText('Nenhum produto com lucro escondido encontrado.', 50, 50);
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
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Produtos com Lucro Escondido'
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
    
    // Limpar gráfico anterior se existir
    if (window.priceSuggestionsChart) {
        window.priceSuggestionsChart.destroy();
    }
    
    if (!suggestions || suggestions.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillText('Nenhuma sugestão de preço disponível.', 50, 50);
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
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Preço Sugerido (R$)',
                    data: suggestedPrices,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Sugestões de Preços'
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