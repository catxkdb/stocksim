class StockMarket {
    constructor() {
        this.cashBalance = 10000;
        this.portfolio = {};
        this.initialInvestment = {}; // Track initial investment for each stock
        this.marketTrend = 0; // -1 to 1, representing bear to bull market
        this.marketVolatility = 0.015; // Base market volatility
        this.lastNewsEvent = Date.now();
        this.newsCooldown = 45000; // 45 seconds between news events (increased from 15 seconds)
        this.newsImpactMultiplier = 5.0; // Increased from 2.5 to 5.0 for more dramatic effects
        this.newsFlashDuration = 2000; // Duration of price flash effect in ms
        
        // Define stock correlations and sectors
        this.sectors = {
            'TECH': ['AAPL', 'MSFT', 'GOOGL'],
            'RETAIL': ['AMZN'],
            'AUTO': ['TSLA']
        };
        
        this.stocks = {
            'AAPL': { 
                name: 'Apple Inc.', 
                price: 150.00, 
                baseVolatility: 0.02, 
                history: [], 
                color: '#e74c3c', 
                yAxisID: 'y-axis-0', 
                previousPrice: 150.00, 
                visible: true,
                sector: 'TECH',
                beta: 1.2, // Market sensitivity
                meanPrice: 150.00, // Mean reversion target
                momentum: 0
            },
            'GOOGL': { 
                name: 'Google LLC', 
                price: 2800.00, 
                baseVolatility: 0.015, 
                history: [], 
                color: '#3498db', 
                yAxisID: 'y-axis-1', 
                previousPrice: 2800.00, 
                visible: true,
                sector: 'TECH',
                beta: 1.1,
                meanPrice: 2800.00,
                momentum: 0
            },
            'MSFT': { 
                name: 'Microsoft Corp', 
                price: 280.00, 
                baseVolatility: 0.018, 
                history: [], 
                color: '#2ecc71', 
                yAxisID: 'y-axis-2', 
                previousPrice: 280.00, 
                visible: true,
                sector: 'TECH',
                beta: 1.15,
                meanPrice: 280.00,
                momentum: 0
            },
            'AMZN': { 
                name: 'Amazon.com Inc', 
                price: 3300.00, 
                baseVolatility: 0.025, 
                history: [], 
                color: '#f1c40f', 
                yAxisID: 'y-axis-3', 
                previousPrice: 3300.00, 
                visible: true,
                sector: 'RETAIL',
                beta: 1.3,
                meanPrice: 3300.00,
                momentum: 0
            },
            'TSLA': { 
                name: 'Tesla Inc', 
                price: 900.00, 
                baseVolatility: 0.03, 
                history: [], 
                color: '#9b59b6', 
                yAxisID: 'y-axis-4', 
                previousPrice: 900.00, 
                visible: true,
                sector: 'AUTO',
                beta: 1.8,
                meanPrice: 900.00,
                momentum: 0
            }
        };
        this.maxDataPoints = 50; // Maximum number of data points to show on graph
        this.sliderValues = {}; // Store current slider values
        this.timeScale = 5; // Default to 5 minutes
        this.updateInterval = 3000; // Default 3 seconds
        this.simulationInterval = null;
        this.initializeChart();
        this.initializeControls();
        this.updateUI();
        this.startMarketSimulation();

        // Add more detailed news events
        this.newsEvents = {
            positive: [
                {
                    type: 'earnings',
                    events: [
                        'reports Q4 earnings of $2.50 per share, beating estimates of $2.30',
                        'announces record quarterly revenue of $89.5 billion, up 15% year-over-year',
                        'exceeds profit expectations with $12.3 billion in net income',
                        'reports strong growth in cloud services division, up 35% year-over-year'
                    ]
                },
                {
                    type: 'product',
                    events: [
                        'launches next-generation AI-powered product line',
                        'announces breakthrough in battery technology, promising 50% longer life',
                        'unveils revolutionary new service platform with 1 million pre-orders',
                        'introduces innovative subscription model with 30% higher margins'
                    ]
                },
                {
                    type: 'expansion',
                    events: [
                        'secures $5 billion government contract for infrastructure development',
                        'announces expansion into emerging markets with $3 billion investment',
                        'partners with industry leader for global distribution network',
                        'acquires key competitor for $8 billion, expanding market share'
                    ]
                },
                {
                    type: 'financial',
                    events: [
                        'announces $20 billion stock buyback program',
                        'increases dividend by 25% to $1.25 per share',
                        'secures $10 billion in new financing at favorable rates',
                        'completes debt restructuring, reducing interest payments by 40%'
                    ]
                }
            ],
            negative: [
                {
                    type: 'earnings',
                    events: [
                        'misses Q4 earnings estimates, reporting $1.80 per share vs. $2.20 expected',
                        'reports 12% decline in quarterly revenue due to market conditions',
                        'warns of lower profit margins in upcoming quarters',
                        'announces restructuring charges of $500 million'
                    ]
                },
                {
                    type: 'product',
                    events: [
                        'delays launch of key product due to technical issues',
                        'announces recall of flagship product affecting 100,000 units',
                        'faces criticism over product quality issues',
                        'loses key patent lawsuit, facing $2 billion in damages'
                    ]
                },
                {
                    type: 'market',
                    events: [
                        'loses major client contract worth $1.5 billion',
                        'faces regulatory investigation into business practices',
                        'announces layoffs affecting 5,000 employees',
                        'reports significant data breach affecting customer information'
                    ]
                },
                {
                    type: 'financial',
                    events: [
                        'cuts dividend by 30% due to cash flow concerns',
                        'warns of potential credit rating downgrade',
                        'reports $3 billion in unexpected expenses',
                        'faces class-action lawsuit over financial disclosures'
                    ]
                }
            ]
        };

        // Add sector-specific news impacts
        this.sectorNews = {
            TECH: {
                positive: [
                    'Industry-wide adoption of new technology standard',
                    'Major breakthrough in semiconductor manufacturing',
                    'Increased government funding for tech innovation',
                    'Strong demand for cloud computing services'
                ],
                negative: [
                    'New regulatory restrictions on data privacy',
                    'Global chip shortage affecting production',
                    'Increased competition from emerging markets',
                    'Rising costs of raw materials'
                ]
            },
            RETAIL: {
                positive: [
                    'Record holiday shopping season',
                    'Successful expansion into new markets',
                    'Strong growth in e-commerce sales',
                    'Favorable changes in consumer spending patterns'
                ],
                negative: [
                    'Rising shipping and logistics costs',
                    'Increased competition from online retailers',
                    'Changing consumer preferences',
                    'Supply chain disruptions'
                ]
            },
            AUTO: {
                positive: [
                    'Breakthrough in electric vehicle technology',
                    'Strong demand for new vehicle models',
                    'Favorable government incentives for EV adoption',
                    'Successful launch of autonomous driving features'
                ],
                negative: [
                    'Rising raw material costs',
                    'Global semiconductor shortage',
                    'Stricter emissions regulations',
                    'Increased competition in EV market'
                ]
            }
        };

        // Update the generateNewsMessage method
        this.generateNewsMessage = (stock, impact) => {
            const stockName = this.stocks[stock].name;
            const isPositive = impact > 0;
            const newsType = isPositive ? this.newsEvents.positive : this.newsEvents.negative;
            
            // Select random news type and event
            const selectedType = newsType[Math.floor(Math.random() * newsType.length)];
            const event = selectedType.events[Math.floor(Math.random() * selectedType.events.length)];
            
            // Add sector context
            const sector = this.stocks[stock].sector;
            const sectorNews = this.sectorNews[sector];
            const sectorEvent = isPositive ? 
                sectorNews.positive[Math.floor(Math.random() * sectorNews.positive.length)] :
                sectorNews.negative[Math.floor(Math.random() * sectorNews.negative.length)];
            
            // Combine company and sector news
            return `${stockName} ${event}. Meanwhile, ${sector} sector ${sectorEvent.toLowerCase()}.`;
        };

        // Initialize start screen
        this.initializeStartScreen();

        // Initialize modal
        this.currentStep = 1;
        this.quizAnswers = {};
        this.initializeModal();

        this.score = 0;
        this.correctAnswers = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.initialPortfolioValue = 10000;

        this.questions = [
            {
                title: "Impact Assessment",
                text: "How significant do you think this news will be for the stock price?",
                options: [
                    { text: "High Impact (>5% price change)", data: { impact: "high" } },
                    { text: "Moderate Impact (2-5% price change)", data: { impact: "moderate" } },
                    { text: "Low Impact (<2% price change)", data: { impact: "low" } }
                ]
            },
            {
                title: "Trading Action",
                text: "What would be the most appropriate trading action based on this news?",
                options: [
                    { text: "Buy - News is positive", data: { action: "buy" } },
                    { text: "Sell - News is negative", data: { action: "sell" } },
                    { text: "Hold - Wait for more information", data: { action: "hold" } }
                ]
            },
            {
                title: "Sector Impact",
                text: "How will this news affect other stocks in the same sector?",
                options: [
                    { text: "Positive Effect - Sector will benefit", data: { effect: "positive" } },
                    { text: "Negative Effect - Sector will decline", data: { effect: "negative" } },
                    { text: "Neutral Effect - No significant impact", data: { effect: "neutral" } }
                ]
            },
            {
                title: "Trading Strategy",
                text: "What's the most important factor to consider in your trading decision?",
                options: [
                    { text: "Timing - When to enter/exit", data: { factor: "timing" } },
                    { text: "Position Size - How much to trade", data: { factor: "position" } },
                    { text: "Risk Management - Stop loss and targets", data: { factor: "risk" } }
                ]
            }
        ];

        // Initialize leaderboard data
        this.leaderboardData = {
            trading: [
                { player: "TraderPro", profit: 25000 },
                { player: "StockMaster", profit: 18750 },
                { player: "InvestorKing", profit: 15000 },
                { player: "MarketWizard", profit: 12500 },
                { player: "TradingGuru", profit: 10000 }
            ],
            quiz: [
                { player: "QuizMaster", score: 2500, streak: 8 },
                { player: "BrainBox", score: 2200, streak: 7 },
                { player: "SmartTrader", score: 2000, streak: 6 },
                { player: "MarketGenius", score: 1800, streak: 5 },
                { player: "StockSage", score: 1500, streak: 4 }
            ]
        };

        // Initialize leaderboard
        this.initializeLeaderboard();
    }

    initializeChart() {
        const ctx = document.getElementById('stockChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: Object.keys(this.stocks).map(symbol => ({
                    label: symbol,
                    data: [],
                    borderColor: this.stocks[symbol].color,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    yAxisID: this.stocks[symbol].yAxisID
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    'y-axis-0': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: this.stocks['AAPL'].color,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    'y-axis-1': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: this.stocks['GOOGL'].color,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    'y-axis-2': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: this.stocks['MSFT'].color,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    'y-axis-3': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: this.stocks['AMZN'].color,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    'y-axis-4': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: this.stocks['TSLA'].color,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });

        // Initialize history with current prices
        for (let symbol in this.stocks) {
            this.stocks[symbol].history.push({
                price: this.stocks[symbol].price,
                timestamp: new Date()
            });
        }
    }

    initializeControls() {
        // Initialize trend toggle buttons
        const trendButtons = document.querySelector('.trend-buttons');
        Object.keys(this.stocks).forEach(symbol => {
            const button = document.createElement('button');
            button.className = 'trend-button active';
            button.textContent = symbol;
            button.onclick = () => this.toggleTrend(symbol);
            trendButtons.appendChild(button);
        });

        // Initialize toggle all button
        document.getElementById('toggleAllTrends').onclick = () => this.toggleAllTrends();

        // Initialize time scale buttons
        document.querySelectorAll('.time-scale').forEach(button => {
            button.onclick = () => this.setTimeScale(parseInt(button.dataset.minutes));
        });

        // Initialize speed control buttons
        document.querySelectorAll('.speed-button').forEach(button => {
            button.onclick = () => this.setSimulationSpeed(parseInt(button.dataset.speed));
        });
    }

    toggleTrend(symbol) {
        this.stocks[symbol].visible = !this.stocks[symbol].visible;
        const button = document.querySelector(`.trend-button:nth-child(${Object.keys(this.stocks).indexOf(symbol) + 2})`);
        button.classList.toggle('active');
        this.updateChart();
    }

    toggleAllTrends() {
        const allVisible = Object.values(this.stocks).every(stock => stock.visible);
        Object.keys(this.stocks).forEach(symbol => {
            this.stocks[symbol].visible = !allVisible;
            const button = document.querySelector(`.trend-button:nth-child(${Object.keys(this.stocks).indexOf(symbol) + 2})`);
            button.classList.toggle('active', !allVisible);
        });
        this.updateChart();
    }

    setTimeScale(minutes) {
        this.timeScale = minutes;
        
        // Update active state of buttons
        document.querySelectorAll('.time-scale').forEach(button => {
            button.classList.toggle('active', parseInt(button.dataset.minutes) === minutes);
        });

        this.updateChart();
    }

    setSimulationSpeed(seconds) {
        // Update active state of buttons
        document.querySelectorAll('.speed-button').forEach(button => {
            button.classList.toggle('active', parseInt(button.dataset.speed) === seconds);
        });

        // Stop current simulation
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }

        // If speed is 0 (pause), don't start new simulation
        if (seconds === 0) return;

        // Start new simulation with new interval
        this.updateInterval = seconds * 1000;
        this.startMarketSimulation();
    }

    getFilteredHistory(history) {
        if (this.timeScale === 0) return history; // Show all history

        const cutoffTime = new Date(Date.now() - this.timeScale * 60 * 1000);
        return history.filter(h => h.timestamp >= cutoffTime);
    }

    updateMarketTrend() {
        // Gradually shift market trend
        const trendChange = (Math.random() - 0.5) * 0.02;
        this.marketTrend = Math.max(-1, Math.min(1, this.marketTrend + trendChange));
        
        // Update market volatility based on trend
        this.marketVolatility = 0.005 + Math.abs(this.marketTrend) * 0.003;
    }

    initializeStartScreen() {
        // Initialize lesson cards
        const lessonCards = document.querySelectorAll('.lesson-card');
        lessonCards.forEach(card => {
            card.addEventListener('click', () => {
                const lesson = card.dataset.lesson;
                if (lesson === 'freeplay') {
                    // Start simulation directly
                    document.getElementById('startScreen').style.display = 'none';
                    document.getElementById('simulationScreen').style.display = 'block';
                    this.startMarketSimulation();
                } else if (lesson === 'media') {
                    // Show media analysis tutorial
                    document.querySelector('.lesson-selection').style.display = 'none';
                    document.querySelector('.tutorial-section').style.display = 'block';
                } else {
                    // Show coming soon message for other lessons
                    alert('This lesson is coming soon!');
                }
            });
        });

        // Initialize start button
        const startButton = document.getElementById('startSimulation');
        startButton.addEventListener('click', () => {
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('simulationScreen').style.display = 'block';
            this.startMarketSimulation();
        });

        // Add back button to tutorial section
        const tutorialSection = document.querySelector('.tutorial-section');
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.textContent = '← Back to Lessons';
        backButton.onclick = () => {
            tutorialSection.style.display = 'none';
            document.querySelector('.lesson-selection').style.display = 'block';
        };
        tutorialSection.insertBefore(backButton, tutorialSection.firstChild);
    }

    generateNewsMessage(stock, impact) {
        const stockName = this.stocks[stock].name;
        const isPositive = impact > 0;
        const newsType = isPositive ? this.newsEvents.positive : this.newsEvents.negative;
        
        // Select random news type and event
        const selectedType = newsType[Math.floor(Math.random() * newsType.length)];
        const event = selectedType.events[Math.floor(Math.random() * selectedType.events.length)];
        
        // Add sector context
        const sector = this.stocks[stock].sector;
        const sectorNews = this.sectorNews[sector];
        const sectorEvent = isPositive ? 
            sectorNews.positive[Math.floor(Math.random() * sectorNews.positive.length)] :
            sectorNews.negative[Math.floor(Math.random() * sectorNews.negative.length)];
        
        // Combine company and sector news
        return `${stockName} ${event}. Meanwhile, ${sector} sector ${sectorEvent.toLowerCase()}.`;
    }

    generateNewsEvent() {
        if (Date.now() - this.lastNewsEvent < this.newsCooldown) return null;

        const sectors = Object.keys(this.sectors);
        const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
        const stocks = this.sectors[randomSector];
        const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
        
        // Increased impact range with more dramatic effects
        const impact = (Math.random() - 0.5) * 0.08 * this.newsImpactMultiplier;
        this.lastNewsEvent = Date.now();
        
        // Add sector-wide impact
        const sectorImpact = impact * 0.3; // 30% of the main impact affects other stocks in the sector
        
        return {
            stock: randomStock,
            impact: impact,
            sectorImpact: sectorImpact,
            message: this.generateNewsMessage(randomStock, impact)
        };
    }

    calculateStockPriceChange(symbol) {
        const stock = this.stocks[symbol];
        
        // Market trend influence
        const marketInfluence = this.marketTrend * stock.beta * this.marketVolatility;
        
        // Mean reversion
        const meanReversion = (stock.meanPrice - stock.price) * 0.0002;
        
        // Momentum
        const momentum = stock.momentum * 0.05;
        
        // Random walk
        const randomWalk = (Math.random() - 0.5) * (stock.baseVolatility * 0.5);
        
        // Sector correlation
        let sectorInfluence = 0;
        const sectorStocks = this.sectors[stock.sector];
        if (sectorStocks.length > 1) {
            sectorInfluence = sectorStocks.reduce((sum, otherSymbol) => {
                if (otherSymbol === symbol) return sum;
                const otherStock = this.stocks[otherSymbol];
                return sum + (otherStock.price - otherStock.previousPrice) / otherStock.previousPrice;
            }, 0) / (sectorStocks.length - 1) * 0.1;
        }
        
        // Combine all factors
        const totalChange = (marketInfluence + meanReversion + momentum + randomWalk + sectorInfluence) * stock.price;
        
        // Update momentum
        stock.momentum = (stock.momentum * 0.95) + (totalChange / stock.price * 0.05);
        
        return totalChange;
    }

    updateStockPrices() {
        const timestamp = new Date();
        
        // Update market trend
        this.updateMarketTrend();
        
        // Check for news events
        const news = this.generateNewsEvent();
        if (news) {
            // Show news analysis before applying impact
            this.showNewsAnalysis(news);
            
            // Apply impact to the main stock
            const stock = this.stocks[news.stock];
            const newsImpact = news.impact * stock.price;
            stock.price += newsImpact;
            
            // Apply sector-wide impact
            const sectorStocks = this.sectors[stock.sector];
            sectorStocks.forEach(symbol => {
                if (symbol !== news.stock) {
                    const otherStock = this.stocks[symbol];
                    const sectorNewsImpact = news.sectorImpact * otherStock.price;
                    otherStock.price += sectorNewsImpact;
                }
            });
            
            // Show news alert
            this.showNewsAlert(news.message, news.impact);
        }
        
        // Update each stock's price
        for (let symbol in this.stocks) {
            const stock = this.stocks[symbol];
            stock.previousPrice = stock.price;
            
            // Calculate price change
            const change = this.calculateStockPriceChange(symbol);
            stock.price = Math.max(0.01, stock.price + change);
            
            // Add new price to history
            stock.history.push({
                price: stock.price,
                timestamp: timestamp
            });

            // Keep only the last maxDataPoints
            if (stock.history.length > this.maxDataPoints) {
                stock.history.shift();
            }
        }

        this.updateChart();
        this.updateUI();
    }

    showNewsAlert(message, impact) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'news-alert';
        alertDiv.style.color = impact > 0 ? '#2ecc71' : '#e74c3c';
        alertDiv.style.fontWeight = 'bold';
        alertDiv.style.fontSize = '1.2em';
        alertDiv.style.padding = '15px';
        alertDiv.style.margin = '10px 0';
        alertDiv.style.border = `2px solid ${impact > 0 ? '#2ecc71' : '#e74c3c'}`;
        alertDiv.style.backgroundColor = impact > 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)';
        
        // Add impact percentage to the message
        const impactPercent = (Math.abs(impact) * 100).toFixed(1);
        alertDiv.textContent = `${message} (${impact > 0 ? '+' : '-'}${impactPercent}% impact)`;
        
        const graphsSection = document.querySelector('.graphs-section');
        graphsSection.insertBefore(alertDiv, document.querySelector('.graph-container'));
        
        // Remove alert after 8 seconds
        setTimeout(() => alertDiv.remove(), 8000);
    }

    flashPriceChange(element, isPositive) {
        element.style.transition = 'background-color 0.3s';
        element.style.backgroundColor = isPositive ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)';
        
        setTimeout(() => {
            element.style.backgroundColor = '';
        }, this.newsFlashDuration);
    }

    updateChart() {
        // Get filtered history for the first stock to use for labels
        const filteredHistory = this.getFilteredHistory(this.stocks['AAPL'].history);
        
        // Update labels (timestamps)
        this.chart.data.labels = filteredHistory.map(h => 
            h.timestamp.toLocaleTimeString()
        );

        // Update datasets
        this.chart.data.datasets.forEach(dataset => {
            const symbol = dataset.label;
            const stock = this.stocks[symbol];
            const filteredData = this.getFilteredHistory(stock.history);
            dataset.data = filteredData.map(h => h.price);
            dataset.hidden = !stock.visible;
        });
        
        this.chart.update();
    }

    getPriceColor(symbol) {
        const stock = this.stocks[symbol];
        return stock.price >= stock.previousPrice ? '#2ecc71' : '#e74c3c';
    }

    buyStock(symbol, quantity) {
        const stock = this.stocks[symbol];
        const totalCost = stock.price * quantity;

        if (totalCost > this.cashBalance) {
            alert('Insufficient funds!');
            return;
        }

        this.cashBalance -= totalCost;
        this.portfolio[symbol] = (this.portfolio[symbol] || 0) + quantity;
        
        // Track initial investment
        if (!this.initialInvestment[symbol]) {
            this.initialInvestment[symbol] = {
                totalCost: totalCost,
                shares: quantity
            };
        } else {
            // Calculate weighted average for multiple purchases
            const currentTotal = this.initialInvestment[symbol].totalCost;
            const currentShares = this.initialInvestment[symbol].shares;
            const newTotal = currentTotal + totalCost;
            const newShares = currentShares + quantity;
            this.initialInvestment[symbol] = {
                totalCost: newTotal,
                shares: newShares
            };
        }
        
        this.updateUI();
    }

    sellStock(symbol, quantity) {
        if (!this.portfolio[symbol] || this.portfolio[symbol] < quantity) {
            alert('Not enough shares to sell!');
            return;
        }

        const stock = this.stocks[symbol];
        const totalValue = stock.price * quantity;

        this.cashBalance += totalValue;
        this.portfolio[symbol] -= quantity;

        // Update initial investment proportionally
        if (this.initialInvestment[symbol]) {
            const ratio = quantity / (this.initialInvestment[symbol].shares + quantity);
            this.initialInvestment[symbol].totalCost *= (1 - ratio);
            this.initialInvestment[symbol].shares -= quantity;
        }

        if (this.portfolio[symbol] === 0) {
            delete this.portfolio[symbol];
            delete this.initialInvestment[symbol];
        }

        this.updateUI();
    }

    calculatePortfolioValue() {
        let total = 0;
        for (let symbol in this.portfolio) {
            total += this.stocks[symbol].price * this.portfolio[symbol];
        }
        return total;
    }

    calculateStockProfitLoss(symbol) {
        if (!this.portfolio[symbol] || !this.initialInvestment[symbol]) return { amount: 0, percentage: 0 };
        
        const currentValue = this.stocks[symbol].price * this.portfolio[symbol];
        const initialValue = this.initialInvestment[symbol].totalCost;
        const amount = currentValue - initialValue;
        const percentage = (amount / initialValue) * 100;
        
        return { amount, percentage };
    }

    calculateTotalProfitLoss() {
        let totalAmount = 0;
        let totalInitial = 0;
        
        for (let symbol in this.portfolio) {
            const pl = this.calculateStockProfitLoss(symbol);
            totalAmount += pl.amount;
            totalInitial += this.initialInvestment[symbol].totalCost;
        }
        
        const totalPercentage = totalInitial > 0 ? (totalAmount / totalInitial) * 100 : 0;
        return { amount: totalAmount, percentage: totalPercentage };
    }

    formatProfitLoss(amount, percentage) {
        const amountStr = amount >= 0 ? 
            `+$${amount.toFixed(2)}` : 
            `-$${Math.abs(amount).toFixed(2)}`;
        const percentageStr = percentage >= 0 ? 
            `(+${percentage.toFixed(2)}%)` : 
            `(${percentage.toFixed(2)}%)`;
        return `${amountStr} ${percentageStr}`;
    }

    updateUI() {
        // Update cash balance and portfolio value
        document.getElementById('cashBalance').textContent = `$${this.cashBalance.toFixed(2)}`;
        document.getElementById('portfolioValue').textContent = `$${this.calculatePortfolioValue().toFixed(2)}`;

        // Update market list
        const stockList = document.getElementById('stockList');
        stockList.innerHTML = '';
        
        for (let symbol in this.stocks) {
            const stock = this.stocks[symbol];
            const maxShares = Math.floor(this.cashBalance / stock.price);
            const currentValue = this.sliderValues[`quantity-${symbol}`] || '1';
            const sliderValue = Math.min(parseInt(currentValue), maxShares);
            
            const stockElement = document.createElement('div');
            stockElement.className = 'stock-item';
            stockElement.innerHTML = `
                <div class="stock-info">
                    <div class="stock-symbol">${symbol} - ${stock.name}</div>
                    <div class="stock-price" style="color: ${this.getPriceColor(symbol)}">$${stock.price.toFixed(2)}</div>
                </div>
                <div class="stock-actions">
                    <div class="quantity-control">
                        <input type="range" 
                               class="quantity-slider" 
                               min="1" 
                               max="${maxShares}" 
                               value="${sliderValue}" 
                               id="slider-${symbol}"
                               oninput="market.updateQuantityDisplay('${symbol}', this.value)">
                        <span class="quantity-value" id="quantity-${symbol}">${sliderValue}</span>
                    </div>
                    <button onclick="market.buyStock('${symbol}', parseInt(document.getElementById('quantity-${symbol}').textContent))">Buy</button>
                </div>
            `;
            stockList.appendChild(stockElement);

            // Flash price change if it was affected by news
            if (stock.price !== stock.previousPrice) {
                const priceElement = stockElement.querySelector('.stock-price');
                this.flashPriceChange(priceElement, stock.price > stock.previousPrice);
            }
        }

        // Update portfolio list
        const portfolioList = document.getElementById('portfolioList');
        portfolioList.innerHTML = '';

        // Add total profit/loss at the top of portfolio
        const totalPL = this.calculateTotalProfitLoss();
        const totalPLElement = document.createElement('div');
        totalPLElement.className = 'portfolio-total-pl';
        totalPLElement.innerHTML = `
            <h3>Total Profit/Loss: 
                <span style="color: ${totalPL.amount >= 0 ? '#2ecc71' : '#e74c3c'}">
                    ${this.formatProfitLoss(totalPL.amount, totalPL.percentage)}
                </span>
            </h3>
        `;
        portfolioList.appendChild(totalPLElement);

        for (let symbol in this.portfolio) {
            const stock = this.stocks[symbol];
            const pl = this.calculateStockProfitLoss(symbol);
            const currentValue = this.sliderValues[`quantity-sell-${symbol}`] || '1';
            const sliderValue = Math.min(parseInt(currentValue), this.portfolio[symbol]);
            
            const portfolioElement = document.createElement('div');
            portfolioElement.className = 'portfolio-item';
            portfolioElement.innerHTML = `
                <div class="stock-info">
                    <div class="stock-symbol">${symbol} - ${stock.name}</div>
                    <div>Shares: ${this.portfolio[symbol]}</div>
                    <div class="stock-price" style="color: ${this.getPriceColor(symbol)}">
                        Value: $${(stock.price * this.portfolio[symbol]).toFixed(2)}
                    </div>
                    <div class="profit-loss" style="color: ${pl.amount >= 0 ? '#2ecc71' : '#e74c3c'}">
                        P/L: ${this.formatProfitLoss(pl.amount, pl.percentage)}
                    </div>
                </div>
                <div class="stock-actions">
                    <div class="quantity-control">
                        <input type="range" 
                               class="quantity-slider" 
                               min="1" 
                               max="${this.portfolio[symbol]}" 
                               value="${sliderValue}" 
                               id="slider-sell-${symbol}"
                               oninput="market.updateQuantityDisplay('${symbol}', this.value, true)">
                        <span class="quantity-value" id="quantity-sell-${symbol}">${sliderValue}</span>
                    </div>
                    <button class="sell" onclick="market.sellStock('${symbol}', parseInt(document.getElementById('quantity-sell-${symbol}').textContent))">Sell</button>
                </div>
            `;
            portfolioList.appendChild(portfolioElement);
        }

        // Update total value displays for all sliders
        for (let symbol in this.stocks) {
            const buyValue = this.sliderValues[`quantity-${symbol}`];
            if (buyValue) {
                this.updateQuantityDisplay(symbol, buyValue);
            }
        }
        for (let symbol in this.portfolio) {
            const sellValue = this.sliderValues[`quantity-sell-${symbol}`];
            if (sellValue) {
                this.updateQuantityDisplay(symbol, sellValue, true);
            }
        }
    }

    updateQuantityDisplay(symbol, value, isSell = false) {
        const prefix = isSell ? 'quantity-sell-' : 'quantity-';
        const displayElement = document.getElementById(prefix + symbol);
        displayElement.textContent = value;
        
        // Store the slider value
        this.sliderValues[prefix + symbol] = value;
        
        // Update the total cost/value display
        const stock = this.stocks[symbol];
        const total = stock.price * parseInt(value);
        const totalElement = document.createElement('div');
        totalElement.className = 'total-value';
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
        
        // Remove any existing total value display
        const existingTotal = displayElement.parentElement.querySelector('.total-value');
        if (existingTotal) {
            existingTotal.remove();
        }
        
        // Add the new total value display
        displayElement.parentElement.appendChild(totalElement);
    }

    startMarketSimulation() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
        this.simulationInterval = setInterval(() => this.updateStockPrices(), this.updateInterval);
    }

    initializeModal() {
        const modal = document.getElementById('newsAnalysisModal');
        const closeButton = modal.querySelector('.close-button');
        const continueButton = document.getElementById('continueSimulation');
        const nextButton = document.getElementById('nextStep');

        closeButton.onclick = () => this.closeNewsAnalysis();
        continueButton.onclick = () => this.closeNewsAnalysis();
        nextButton.onclick = () => this.nextStep();
        
        // Close modal when clicking outside
        window.onclick = (event) => {
            if (event.target === modal) {
                this.closeNewsAnalysis();
            }
        };

        // Initialize quiz option click handlers
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleQuizOptionClick(e));
        });
    }

    handleQuizOptionClick(event) {
        const option = event.target;
        const question = option.closest('.quiz-question');
        
        // Remove selected class from other options in the same question
        question.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        option.classList.add('selected');
        
        // Store the answer
        this.quizAnswers[this.currentStep] = option.dataset;
        
        // Enable next button
        document.getElementById('nextStep').disabled = false;
    }

    nextStep() {
        const feedbackMessage = document.querySelector('.feedback-message');
        const nextButton = document.getElementById('nextStep');
        const continueButton = document.getElementById('continueSimulation');
        const impactAnalysis = document.querySelector('.impact-analysis');
        const tradingAdvice = document.querySelector('.trading-advice');
        const scoreSummary = document.querySelector('.score-summary');
        const achievementsSection = document.querySelector('.achievements-section');
        const leaderboardSection = document.querySelector('.leaderboard-section');

        // Check answer for current step
        const isCorrect = this.checkAnswer(this.currentStep);
        
        if (isCorrect) {
            this.correctAnswers++;
            this.currentStreak++;
            this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
            
            // Base points for correct answer
            let points = 100;
            
            // Streak bonus (50 points per streak level)
            points += (this.currentStreak - 1) * 50;
            
            this.score += points;
        } else {
            this.currentStreak = 0;
        }
        
        this.updateScoreDisplay();
        
        // Show feedback with streak information
        feedbackMessage.style.display = 'block';
        let feedbackText = this.getFeedbackMessage(this.currentStep, isCorrect);
        if (isCorrect && this.currentStreak > 1) {
            feedbackText += ` (${this.currentStreak}x streak!)`;
        }
        feedbackMessage.textContent = feedbackText;
        feedbackMessage.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;

        // If it's the last question
        if (this.currentStep === 4) {
            nextButton.style.display = 'none';
            continueButton.style.display = 'block';
            impactAnalysis.style.display = 'block';
            tradingAdvice.style.display = 'block';
            scoreSummary.style.display = 'block';
            achievementsSection.style.display = 'block';
            leaderboardSection.style.display = 'block';
            
            // Update achievements and leaderboard
            this.updateAchievements();
            this.updateLeaderboardWithPlayerData();
            
            // Update final score display
            const tradingScore = this.calculateTradingScore();
            document.getElementById('finalCorrectAnswers').textContent = this.correctAnswers;
            document.getElementById('bestStreak').textContent = this.bestStreak;
            document.getElementById('tradingScore').textContent = `$${tradingScore}`;
            document.getElementById('totalScore').textContent = this.score + tradingScore;
            
            return;
        }

        // Move to next question after a short delay
        setTimeout(() => {
            this.currentStep++;
            this.displayQuestion(this.currentStep);
            feedbackMessage.style.display = 'none';
        }, 2000);
    }

    checkAnswer(step) {
        const answer = this.quizAnswers[step];
        const news = this.currentNews;
        
        switch(step) {
            case 1: // Impact level
                const impactPercent = Math.abs(news.impact * 100);
                const expectedImpact = impactPercent > 5 ? 'high' : 
                                     impactPercent > 2 ? 'moderate' : 'low';
                return answer.impact === expectedImpact;
                
            case 2: // Trading action
                const expectedAction = news.impact > 0 ? 'buy' : 'sell';
                return answer.action === expectedAction;
                
            case 3: // Sector effect
                const expectedEffect = news.sectorImpact > 0 ? 'positive' : 
                                     news.sectorImpact < 0 ? 'negative' : 'neutral';
                return answer.effect === expectedEffect;
                
            case 4: // Trading factor
                const impactPercent2 = Math.abs(news.impact * 100);
                const expectedFactor = impactPercent2 > 5 ? 'timing' : 
                                     impactPercent2 > 2 ? 'position' : 'risk';
                return answer.factor === expectedFactor;
        }
    }

    getFeedbackMessage(step, isCorrect) {
        if (!isCorrect) {
            switch(step) {
                case 1:
                    return "Consider the magnitude of the price change expected from this news.";
                case 2:
                    return "Think about whether this news is positive or negative for the company.";
                case 3:
                    return "Remember that news often affects all companies in the same sector.";
                case 4:
                    return "Consider the size of the expected price movement.";
            }
        }
        
        switch(step) {
            case 1:
                return "Correct! You've accurately assessed the impact level.";
            case 2:
                return "Good job! You've identified the appropriate trading action.";
            case 3:
                return "Excellent! You understand sector-wide effects.";
            case 4:
                return "Perfect! You've identified the key trading consideration.";
        }
    }

    showNewsAnalysis(news) {
        // Store current news for quiz answers
        this.currentNews = news;
        
        // Reset quiz state
        this.currentStep = 1;
        this.quizAnswers = {};
        this.correctAnswers = 0;
        this.currentStreak = 0;
        this.updateScoreDisplay();
        
        document.getElementById('nextStep').style.display = 'block';
        document.getElementById('nextStep').disabled = true;
        document.getElementById('continueSimulation').style.display = 'none';
        
        // Hide all sections initially
        document.querySelector('.impact-analysis').style.display = 'none';
        document.querySelector('.trading-advice').style.display = 'none';
        document.querySelector('.score-summary').style.display = 'none';
        document.querySelector('.achievements-section').style.display = 'none';
        document.querySelector('.leaderboard-section').style.display = 'none';
        
        // Show first question
        this.displayQuestion(1);
        
        // Pause the simulation
        this.setSimulationSpeed(0);
        
        const modal = document.getElementById('newsAnalysisModal');
        const stock = this.stocks[news.stock];
        const impactPercent = (Math.abs(news.impact) * 100).toFixed(1);
        const sectorImpactPercent = (Math.abs(news.sectorImpact) * 100).toFixed(1);
        
        // Update news details
        document.getElementById('newsTitle').textContent = news.message;
        document.getElementById('newsDescription').textContent = 
            `This news event has been detected in the ${stock.sector} sector and may significantly impact market movements.`;
        
        // Prepare impact analysis content (will be shown after quiz)
        const primaryImpactDetails = document.getElementById('primaryImpactDetails');
        primaryImpactDetails.innerHTML = `
            <p><strong>${stock.name} (${news.stock})</strong></p>
            <p>Expected price change: ${news.impact > 0 ? '+' : '-'}${impactPercent}%</p>
            <p>Current price: $${stock.price.toFixed(2)}</p>
            <p>Projected price: $${(stock.price * (1 + news.impact)).toFixed(2)}</p>
        `;
        
        // Prepare sector impact details
        const sectorImpactDetails = document.getElementById('sectorImpactDetails');
        const sectorStocks = this.sectors[stock.sector].filter(s => s !== news.stock);
        let sectorHtml = '';
        sectorStocks.forEach(symbol => {
            const otherStock = this.stocks[symbol];
            sectorHtml += `
                <p><strong>${otherStock.name} (${symbol})</strong></p>
                <p>Expected impact: ${news.sectorImpact > 0 ? '+' : '-'}${sectorImpactPercent}%</p>
                <p>Current price: $${otherStock.price.toFixed(2)}</p>
                <p>Projected price: $${(otherStock.price * (1 + news.sectorImpact)).toFixed(2)}</p>
            `;
        });
        sectorImpactDetails.innerHTML = sectorHtml;
        
        // Prepare trading advice
        const tradingAdvice = document.getElementById('tradingAdvice');
        tradingAdvice.innerHTML = this.generateTradingAdvice(news);
        
        // Show modal
        modal.style.display = 'block';
    }

    generateTradingAdvice(news) {
        const stock = this.stocks[news.stock];
        const impactPercent = Math.abs(news.impact * 100);
        let advice = '';
        
        if (impactPercent > 5) {
            advice = `
                <p><strong>High Impact Event</strong></p>
                <p>This is a significant market-moving event that could create trading opportunities:</p>
                <ul>
                    <li>Consider ${news.impact > 0 ? 'buying' : 'selling'} ${stock.name} shares</li>
                    <li>Watch for sector-wide movements in ${stock.sector} stocks</li>
                    <li>Monitor price action for potential entry/exit points</li>
                </ul>
            `;
        } else if (impactPercent > 2) {
            advice = `
                <p><strong>Moderate Impact Event</strong></p>
                <p>This event may create short-term trading opportunities:</p>
                <ul>
                    <li>Consider ${news.impact > 0 ? 'small position' : 'reducing position'} in ${stock.name}</li>
                    <li>Watch for confirmation of price movement</li>
                </ul>
            `;
        } else {
            advice = `
                <p><strong>Low Impact Event</strong></p>
                <p>This event may have minimal impact on the market:</p>
                <ul>
                    <li>Monitor price action before making decisions</li>
                    <li>Consider waiting for more significant events</li>
                </ul>
            `;
        }
        
        return advice;
    }

    closeNewsAnalysis() {
        const modal = document.getElementById('newsAnalysisModal');
        modal.style.display = 'none';
        
        // Resume simulation at previous speed
        this.setSimulationSpeed(3); // Default to normal speed
    }

    updateScoreDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = this.correctAnswers;
        document.getElementById('currentStreak').textContent = this.currentStreak;
    }

    calculateTradingScore() {
        const currentPortfolioValue = this.calculatePortfolioValue() + this.cashBalance;
        const profit = currentPortfolioValue - this.initialPortfolioValue;
        return Math.round(profit);
    }

    displayQuestion(questionNumber) {
        const question = this.questions[questionNumber - 1];
        const quizSection = document.querySelector('.quiz-section');
        const questionElement = quizSection.querySelector('.quiz-question');
        
        // Update question number display
        document.getElementById('currentQuestionNumber').textContent = questionNumber;
        
        // Update question content
        questionElement.innerHTML = `
            <h4>${question.title}</h4>
            <p>${question.text}</p>
            <div class="quiz-options">
                ${question.options.map(option => `
                    <button class="quiz-option" data-${Object.keys(option.data)[0]}="${option.data[Object.keys(option.data)[0]]}">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        `;
        
        // Reattach event listeners
        questionElement.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleQuizOptionClick(e));
        });

        // Reset the next button state
        const nextButton = document.getElementById('nextStep');
        nextButton.disabled = true;
    }

    updateAchievements() {
        // Implementation of updateAchievements method
    }

    initializeLeaderboard() {
        // Add tab switching functionality
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                // Update active tab button
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Show corresponding leaderboard tab
                const tabId = button.dataset.tab + 'Leaderboard';
                document.querySelectorAll('.leaderboard-tab').forEach(tab => tab.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Initial leaderboard update
        this.updateLeaderboard();
    }

    updateLeaderboard() {
        // Calculate user's rank in trading
        const userTradingProfit = this.calculateTradingScore();
        const userTradingRank = this.leaderboardData.trading.reduce((rank, entry) => 
            entry.profit > userTradingProfit ? rank + 1 : rank, 1);

        // Calculate user's rank in quiz
        const userQuizRank = this.leaderboardData.quiz.reduce((rank, entry) => 
            entry.score > this.score ? rank + 1 : rank, 1);

        // Update trading leaderboard
        const tradingEntries = document.getElementById('tradingEntries');
        let tradingHtml = `
            <div class="user-rank-display">
                <span>Your Rank: #${userTradingRank}</span>
                <span>Your Profit: $${userTradingProfit.toLocaleString()}</span>
            </div>
        `;
        tradingHtml += this.leaderboardData.trading
            .map((entry, index) => `
                <div class="leaderboard-entry ${entry.player === 'You' ? 'user-entry' : ''}">
                    <span class="rank">#${index + 1}</span>
                    <span class="player">${entry.player}</span>
                    <span class="profit">$${entry.profit.toLocaleString()}</span>
                </div>
            `).join('');

        // Add user's entry if not in top 5
        if (userTradingProfit > 0 && !this.leaderboardData.trading.some(entry => entry.player === 'You')) {
            tradingHtml += `
                <div class="leaderboard-entry user-entry">
                    <span class="rank">#${userTradingRank}</span>
                    <span class="player">You</span>
                    <span class="profit">$${userTradingProfit.toLocaleString()}</span>
                </div>
            `;
        }
        tradingEntries.innerHTML = tradingHtml;

        // Update quiz leaderboard
        const quizEntries = document.getElementById('quizEntries');
        let quizHtml = `
            <div class="user-rank-display">
                <span>Your Rank: #${userQuizRank}</span>
                <span>Your Score: ${this.score}</span>
                <span>Best Streak: ${this.bestStreak}x</span>
            </div>
        `;
        quizHtml += this.leaderboardData.quiz
            .map((entry, index) => `
                <div class="leaderboard-entry ${entry.player === 'You' ? 'user-entry' : ''}">
                    <span class="rank">#${index + 1}</span>
                    <span class="player">${entry.player}</span>
                    <span class="score">${entry.score}</span>
                    <span class="streak">${entry.streak}x</span>
                </div>
            `).join('');

        // Add user's entry if not in top 5
        if (this.score > 0 && !this.leaderboardData.quiz.some(entry => entry.player === 'You')) {
            quizHtml += `
                <div class="leaderboard-entry user-entry">
                    <span class="rank">#${userQuizRank}</span>
                    <span class="player">You</span>
                    <span class="score">${this.score}</span>
                    <span class="streak">${this.bestStreak}x</span>
                </div>
            `;
        }
        quizEntries.innerHTML = quizHtml;
    }

    updateLeaderboardWithPlayerData() {
        // Add current player's data if they have a score
        if (this.score > 0) {
            const quizEntry = {
                player: "You",
                score: this.score,
                streak: this.bestStreak
            };
            
            // Add to quiz leaderboard if score is high enough
            const minQuizScore = Math.min(...this.leaderboardData.quiz.map(entry => entry.score));
            if (this.score > minQuizScore) {
                this.leaderboardData.quiz.push(quizEntry);
                this.leaderboardData.quiz.sort((a, b) => b.score - a.score);
                this.leaderboardData.quiz = this.leaderboardData.quiz.slice(0, 5);
            }
        }

        // Add trading profit if player has made trades
        const tradingProfit = this.calculateTradingScore();
        if (tradingProfit > 0) {
            const tradingEntry = {
                player: "You",
                profit: tradingProfit
            };
            
            // Add to trading leaderboard if profit is high enough
            const minTradingProfit = Math.min(...this.leaderboardData.trading.map(entry => entry.profit));
            if (tradingProfit > minTradingProfit) {
                this.leaderboardData.trading.push(tradingEntry);
                this.leaderboardData.trading.sort((a, b) => b.profit - a.profit);
                this.leaderboardData.trading = this.leaderboardData.trading.slice(0, 5);
            }
        }

        // Update the display
        this.updateLeaderboard();
    }
}

// Initialize the market
const market = new StockMarket(); 