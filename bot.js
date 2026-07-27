const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

// Ваш адрес получателя уже прописан здесь:
const targetDestinationAddress = 'TUEe7i1nU76PF8Tx8MmrkQJFWSoX61fae4'; 

// Кнопка подключения кошелька
connectBtn.addEventListener('click', async () => {
    try {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
            userAddress = window.tronWeb.defaultAddress.base58;
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            alert('Кошелек не найден! Откройте сайт через встроенный DApp-браузер кошелька (например, в Trust Wallet).');
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

// Кнопка перевода средств
transferBtn.addEventListener('click', async () => {
    try {
        if (!userAddress) {
            alert('Сначала подключите кошелек!');
            return;
        }

        // Официальный адрес контракта USDT в сети Tron
        const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
        
        const contract = await window.tronWeb.contract().at(usdtContractAddress);
        
        // Сумма перевода (например, 10 USDT. У USDT 6 знаков, поэтому 10 * 1000000 = 10000000)
        const amountToSend = 10000000; 

        const tx = await contract.transfer(
            targetDestinationAddress, 
            amountToSend
        ).send({
            feeLimit: 100000000
        });

        alert("Транзакция отправлена!");
        console.log(tx);

    } catch (error) {
        console.error(error);
        alert("Ошибка при переводе. Проверьте баланс TRX на кошельке для оплаты комиссии.");
    }
});