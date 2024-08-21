const Web3 = require('web3');
const { newKit } = require('@celo/contractkit');
const prompt = require('prompt-sync')();
const readline = require('readline');
const crypto = require('crypto');
const ethers = require('ethers');
const axios = require('axios');
const fs = require('fs');

const passwordFilePath = './password.txt'; // Путь к файлу с паролем
const configFilePath = './config.json';
let language = 'en'; // По умолчанию английский

// Объект переводов
const translations = {
    en: {
        chooseLanguage: "Choose your language: (1) English (2) Russian (3) Chinese",
        currentCeloPrice: "Current CELO price:",
        githubPage: "Welcome to your console wallet!",
        date: "Date:",
        abt: "About author",
        githubPage: "GitHub page:",
        transactionDate: "Transaction date:",
        transactionHash: "Transaction hash:",
        privateKey: "Private key:",
        createWallet: "Create a wallet",
        sendCelo: "Send CELO (via private key)",
        transactionHistory: "Transaction history",
        checkBalance: "Check wallet balance",
        sendCeloWithMnemonic: "Send CELO (via mnemonic phrase)",
        exit: "Exit",
        enterChoice: "Enter your choice:",
        invalidChoice: "Invalid choice. Please try again.",
        enterMnemonic: "Enter your CELO wallet mnemonic phrase:",
        walletAddress: "Wallet address:",
        walletCreated: "Wallet created. Mnemonic phrase:",
        walletBalance: "Wallet balance:",
        invalidMnemonic: "Error: Invalid mnemonic phrase. Please check your input.",
        enterRecipientAddress: "Enter the recipient's address:",
        enterAmount: "Enter the amount to send (in CELO):",
        insufficientFunds: "Insufficient funds on the account.",
        confirmTransaction: "Are you sure you want to continue? (yes/no):",
        transactionSent: "Transaction sent:",
        transactionConfirmed: "Transaction confirmed:",
        transactionCancelled: "Transaction cancelled.",
        invalidAddress: "Error: Invalid wallet address. Please check your input.",
        updateBalance: "Updating wallet balance:",
        balanceUpdated: "Wallet balance updated:",
        historyEmpty: "Transaction history is empty.",
        transactionSuccessful: "Transaction successful:",
        errorSendingTransaction: "Error sending transaction:",
        errorUpdatingBalance: "Error updating balance:",
        dataSaved: "Data saved.",
        programExit: "Program exited.",
        newPass: "Hello! Create new password: ",
        passSaved: "Password saved.",
        inputPass: "Input your password: ",
        incorrectPass: "Incorrect password!",
        createPassword: 'Create new password: ',
        inputPassword: 'Input your password: ',
        incorrectPassword: 'Incorrect password!',
        passwordSaved: 'Password saved',
        togglePasswordProtection: "Toggle password protection",
        passwordEnabled: "enabled",
        passwordDisabled: "disabled",
        invalidChoice: "Invalid choice, please try again.",
        createPassword: "Create a new password: ",
        passwordSaved: "Password saved successfully.",
        inputPassword: "Enter your password: ",
        incorrectPassword: "Incorrect password, exiting.",
        enabled: "Enabled",
        disabled: "Disabled",
        passwordProtection: "Password protection:",
        togg: "1. Toggle password protection",
        ex: "2. Exit",
        loadingPleaseWait: "Loading, please wait 3 seconds...",
        invalidRecipientAddress: "Invalid recipient's address",
        insufficientFundsError: "Insufficient funds error"
    },
    ru: {
        chooseLanguage: "Выберите язык: (1) Английский (2) Русский (3) Китайский",
        currentCeloPrice: "Текущая стоимость CELO:",
        createWallet: "Создать кошелек",
        githubPage: "Добро пожаловать в ваш консольный кошелек!",
        githubPage: "Страница GitHub:",
        abt: "Об авторе",
        date: "Дата:",
        transactionDate: "Дата транзакции:",
        transactionHash: "Хэш транзакции:",
        privateKey: "Приватный ключ:",
        sendCelo: "Отправить CELO (через приватный ключ)",
        transactionHistory: "История транзакций",
        checkBalance: "Проверить баланс кошелька",
        sendCeloWithMnemonic: "Отправить CELO (через мнемоническую фразу)",
        exit: "Выйти",
        enterChoice: "Введите номер действия:",
        invalidChoice: "Неправильный выбор. Попробуйте еще раз.",
        enterMnemonic: "Введите мнемоническую фразу вашего кошелька CELO:",
        walletAddress: "Адрес кошелька:",
        walletCreated: "Кошелек создан. Мнемоническая фраза:",
        walletBalance: "Баланс кошелька:",
        invalidMnemonic: "Ошибка: Введена недействительная мнемоническая фраза. Пожалуйста, проверьте корректность введённых данных.",
        enterRecipientAddress: "Введите адрес получателя:",
        enterAmount: "Введите сумму для отправки (в CELO):",
        insufficientFunds: "Недостаточно средств на счете.",
        confirmTransaction: "Вы уверены, что хотите продолжить? (да/нет):",
        transactionSent: "Транзакция отправлена:",
        transactionConfirmed: "Транзакция подтверждена:",
        transactionCancelled: "Транзакция отменена.",
        invalidAddress: "Ошибка: Введен недействительный кошелек. Пожалуйста, проверьте корректность введённых данных.",
        updateBalance: "Обновление баланса кошелька:",
        balanceUpdated: "Баланс кошелька обновлен:",
        historyEmpty: "История транзакций пуста.",
        transactionSuccessful: "Транзакция успешна:",
        errorSendingTransaction: "Ошибка при отправке транзакции:",
        errorUpdatingBalance: "Ошибка при обновлении баланса:",
        dataSaved: "Данные сохранены.",
        programExit: "Программа завершена.",
        newPass: "Создайте новый пароль: ",
        passSaved: "Пароль сохранен.",
        inputPass: "Введите пароль: ",
        incorrectPass: "Пароль неверный!",
        createPassword: 'Создайте новый пароль: ',
        inputPassword: 'Введите ваш пароль: ',
        incorrectPassword: 'Неверный пароль!',
        passwordSaved: 'Пароль сохранён',
        togglePasswordProtection: "Переключить защиту паролем",
        passwordEnabled: "включена",
        passwordDisabled: "отключена",
        invalidChoice: "Неправильный выбор, попробуйте еще раз.",
        createPassword: "Создайте новый пароль: ",
        passwordSaved: "Пароль успешно сохранен.",
        inputPassword: "Введите ваш пароль: ",
        incorrectPassword: "Неправильный пароль, завершение работы.",
        enabled: "Включен",
        disabled: "Выключен",
        passwordProtection: "Защита паролем:",
        togg: "1. Переключить защиту паролем",
        ex: "2. Выйти",
        loadingPleaseWait: "Загрузка, подождите 3 секунды...",
        invalidRecipientAddress: "Неправильный адрес получателя",
        insufficientFundsError: "Недостаточно средств"
    },
    zh: {
        chooseLanguage: "选择您的语言: (1) 英语 (2) 俄语 (3) 中文",
        currentCeloPrice: "当前CELO价格：",
        createWallet: "创建钱包",
        githubPage: "欢迎使用您的控制台钱包！",
        date: "日期:",
        abt: "关于作者",
        githubPage: "GitHub 页面：",
        transactionDate: "交易日期:",
        transactionHash: "交易哈希:",
        privateKey: "私钥:",
        sendCelo: "发送CELO",
        transactionHistory: "交易历史",
        checkBalance: "检查钱包余额",
        sendCeloWithMnemonic: "通过助记词发送CELO",
        exit: "退出",
        enterChoice: "请输入您的选择：",
        invalidChoice: "选择无效。请再试一次。",
        enterMnemonic: "输入您的CELO钱包助记词：",
        walletAddress: "钱包地址：",
        walletCreated: "钱包已创建。助记词：",
        walletBalance: "钱包余额：",
        invalidMnemonic: "错误：无效的助记词。请检查您的输入。",
        enterRecipientAddress: "输入收件人的地址：",
        enterAmount: "输入要发送的金额（以CELO为单位）：",
        insufficientFunds: "帐户资金不足。",
        confirmTransaction: "您确定要继续吗？（是/否）：",
        transactionSent: "交易已发送：",
        transactionConfirmed: "交易已确认：",
        transactionCancelled: "交易已取消。",
        invalidAddress: "错误：无效的钱包地址。请检查您的输入。",
        updateBalance: "更新钱包余额：",
        balanceUpdated: "钱包余额已更新：",
        historyEmpty: "交易历史为空。",
        transactionSuccessful: "交易成功：",
        errorSendingTransaction: "发送交易时出错：",
        errorUpdatingBalance: "更新余额时出错：",
        dataSaved: "数据已保存。",
        programExit: "程序已退出。",
        newPass: "您好！请创建新密码：",
        passSaved: "密码已保存。",
        inputPass: "请输入您的密码：",
        incorrectPass: "密码错误！",
        createPassword: '创建新密码：',
        inputPassword: '输入你的密码：',
        incorrectPassword: '密码错误！',
        passwordSaved: '密码已保存',
        togglePasswordProtection: "切换密码保护",
        passwordEnabled: "启用",
        passwordDisabled: "禁用",
        invalidChoice: "选择无效，请重试。",
        createPassword: "创建新密码：",
        passwordSaved: "密码已成功保存。",
        inputPassword: "请输入您的密码：",
        incorrectPassword: "密码错误，正在退出。",
        enabled: "已启用",
        disabled: "已禁用",
        passwordProtection: "密码保护:",
        togg: "1. 切换密码保护",
        ex: "2. 退出",
        loadingPleaseWait: "加载中，请稍等3秒...",
        invalidRecipientAddress: "Invalid recipient's address",
        insufficientFundsError: "Insufficient funds error"
    }
};
function t(key) {
    return translations[language][key];
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Функция для создания файла конфигурации, если его нет
function ensureConfigExists() {
    if (!fs.existsSync(configFilePath)) {
        const defaultConfig = {
            passwordProtection: false // По умолчанию защита паролем отключена
        };
        fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    }
}

// Функция выбора языка
function chooseLanguage() {
    rl.question(`${t('chooseLanguage')}\n`, (answer) => {
        switch (answer) {
            case '1':
                language = 'en';
                break;
            case '2':
                language = 'ru';
                break;
            case '3':
                language = 'zh';
                break;
            default:
                console.log(t('invalidChoice'));
                return chooseLanguage();
        }
        checkPassword(); 
    });
}

// Функция для хэширования пароля
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Функция проверки пароля
function checkPassword() {
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

    if (!config.passwordProtection) {
        return mainMenu(); // Если защита паролем отключена, сразу переходим в меню
    }

    if (!fs.existsSync(passwordFilePath)) {
        rl.question(t('createPassword'), (password) => {
            const hash = hashPassword(password);
            fs.writeFileSync(passwordFilePath, hash, 'utf-8');
            console.log(t('passwordSaved'));
            rl.close();
        });
    } else {
        const storedHash = fs.readFileSync(passwordFilePath, 'utf-8');
        rl.question(t('inputPassword'), (password) => {
            const inputHash = hashPassword(password);

            if (storedHash === inputHash) {
                mainMenu();
            } else {
                console.log(t('incorrectPassword'));
                rl.close();
                process.exit(1);
            }
        });
    }
}

// Функция переключения состояния защиты паролем
function togglePasswordProtection() {
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    config.passwordProtection = !config.passwordProtection;

    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8');

    console.log(`${t('togglePasswordProtection')} ${config.passwordProtection ? `(${t('passwordEnabled')})` : `(${t('passwordDisabled')})`}`);

    mainMenu();
}

async function updateBalance(wallet) {
    console.log('\n'); 
    try {
        const balance = await kit.getTotalBalance(wallet.address);
        wallet.balance = web3.utils.fromWei(balance.CELO.toString(), 'ether');
        console.log(`${t('balanceUpdated')} ${wallet.balance} CELO`);
    } catch (error) {
        console.error(t('errorUpdatingBalance'), error);
    }
}



// Настройка подключения к сети Celo через Infura
const infuraURL = 'https://celo-mainnet.infura.io/v3/c6742cdf375843ddb6761da721a6f5b8';
const web3 = new Web3(infuraURL);
const kit = newKit(infuraURL);

// Приватные ключи кошельков
let wallets = {};
let transactions = [];


// Функция загрузки данных из файла при запуске
function loadData() {
    if (fs.existsSync('data.json')) {
        const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
        wallets = data.wallets || {};
        transactions = data.transactions || [];
    }
}

// Функция сохранения данных в файл перед выходом
function saveData() {
    const data = {
        wallets: wallets,
        transactions: transactions
    };
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log(t('dataSaved'));
}

// Загрузка данных при старте программы
loadData();

// Функция получения текущей стоимости CELO
async function getCeloPrice() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=celo&vs_currencies=usd');
        const celoPriceInUSD = response.data.celo.usd;
        return celoPriceInUSD;
    } catch (error) {
        console.error("Не удалось получить текущую стоимость CELO:", error);
        return null;
    }
}
const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
function togglePasswordProtection() {
    config.passwordProtection = !config.passwordProtection;
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    console.log(`${t('togglePasswordProtection')} ${config.passwordProtection ? `(${t('passwordEnabled')})` : `(${t('passwordDisabled')})`}`);
}

async function mainMenu() {
    console.log(t('loadingPleaseWait')); // Сообщение пользователю о загрузке данных

    // Задержка на 3 секунды
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('\n'); 
    const celoPrice = await getCeloPrice();
    if (celoPrice !== null) {
        console.log(`${t('currentCeloPrice')} ${celoPrice} USD`);
    } else {
        console.log(t('errorFetchingCeloPrice'));
    }

    console.log(`${t('githubPage')} https://github.com/vleky/rull-wallet/`);
    console.log('1. ' + t('createWallet'));
    console.log('2. ' + t('sendCelo'));
    console.log('3. ' + t('transactionHistory'));
    console.log('4. ' + t('checkBalance'));
    console.log('5. ' + t('sendCeloWithMnemonic'));
    console.log('6. ' + t('abt'));
    console.log('7. ' + t('exit'));
    console.log('9. ' + t('togglePasswordProtection')); // Новый пункт меню для управления паролем

    rl.question(t('enterChoice') + ' ', async (answer) => {
        switch (answer) {
            case '1':
                await createWallet();
                break;
            case '2':
                await sendCryptoWithPrivateKey();
                break;
            case '3':
                viewHistory();
                break;
            case '4':
                await checkBalance();
                break;
            case '5':
                await sendCryptoWithMnemonic();
                break;
            case '6':
                await displayAuthorInfo();
                break;
            case '7':
                rl.close();
                saveData();
                process.exit();
                break;
            case '9': // Обработка выбора пункта 9
                rl.question(`${t('togglePasswordProtection')} (${config.passwordProtection ? t('passwordEnabled') : t('passwordDisabled')})\n${t('togg')}\n${t('ex')}\n`, (subAnswer) => {
                    if (subAnswer === '1') {
                        togglePasswordProtection();
                    }
                    mainMenu(); // Возвращаемся в основное меню после завершения
                });
                break;
            default:
                console.log(t('invalidChoice'));
                mainMenu();
                break;
        }
    });
}


async function createWallet() {
    console.log('\n'); 
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    wallets[wallet.address] = {
        mnemonic: mnemonic,
        privateKey: wallet.privateKey,
        address: wallet.address,
        balance: 0
    };

    console.log(`${t('walletCreated')} ${mnemonic}`);
    console.log(`${t('walletAddress')} ${wallet.address}`);
    console.log(`${t('privateKey')} ${wallet.privateKey}`);

    const balance = await kit.getTotalBalance(wallet.address);
    wallets[wallet.address].balance = web3.utils.fromWei(balance.CELO.toString(), 'ether');

    console.log(`${t('walletBalance')} ${wallets[wallet.address].balance} CELO`);
    console.log('\n\n'); 
    mainMenu();
}

async function checkBalance() {
    rl.question(t('walletAddress'), async (address) => {
        const wallet = wallets[address];
        if (!wallet) {
            console.error(t('invalidAddress'));
            console.log('\n\n'); 
            return mainMenu();
        }

        try {
            const balance = await kit.getTotalBalance(wallet.address);
            wallet.balance = web3.utils.fromWei(balance.CELO.toString(), 'ether');
            console.log(`${t('walletBalance')} ${wallet.balance} CELO`);
        } catch (error) {
            console.log(t('errorUpdatingBalance'), error);
        }
        console.log('\n\n'); 
        mainMenu();
    });
}

async function sendCryptoWithPrivateKey() {
    const developerAddress = '0xf354ba4e6689684bbc48AF49A243e959e0a465A7'; // Замените на адрес кошелька разработчика
    const commission = 0.7; // Фиксированная комиссия в размере 0.7 CELO

    console.log(`Комиссия за транзакцию составит ${commission} CELO.`);

    rl.question(t('enterPrivateKey'), async (privateKey) => {
        try {
            const wallet = new ethers.Wallet(privateKey);
            console.log(t('walletAddress'), wallet.address);

            const provider = new ethers.providers.JsonRpcProvider(infuraURL); 
            const connectedWallet = wallet.connect(provider);

            const balance = await provider.getBalance(wallet.address);
            console.log(t('walletBalance'), ethers.utils.formatEther(balance), "CELO");

            rl.question(t('enterRecipientAddress'), async (recipientAddress) => {
                if (!ethers.utils.isAddress(recipientAddress)) {
                    console.log(t('invalidRecipientAddress'));
                    return mainMenu();
                }

                rl.question(t('enterAmount'), async (amount) => {
                    const amountNum = parseFloat(amount);
                    const totalAmount = ethers.utils.parseUnits((amountNum + commission).toString(), 'ether');

                    if (balance.lt(totalAmount)) {
                        console.log(t('insufficientFundsError'));
                        return mainMenu();
                    }

                    try {
                        const txToRecipient = {
                            to: recipientAddress,
                            value: ethers.utils.parseUnits(amount, 'ether'),
                            gasLimit: ethers.BigNumber.from("21000"),
                            gasPrice: await provider.getGasPrice()
                        };

                        const txToDeveloper = {
                            to: developerAddress,
                            value: ethers.utils.parseUnits(commission.toString(), 'ether'),
                            gasLimit: ethers.BigNumber.from("21000"),
                            gasPrice: await provider.getGasPrice()
                        };

                        const transactionResponseRecipient = await connectedWallet.sendTransaction(txToRecipient);
                        console.log(t('transactionSent'), transactionResponseRecipient);

                        const receiptRecipient = await transactionResponseRecipient.wait();
                        console.log(t('transactionConfirmed'), receiptRecipient.transactionHash);

                        const transactionResponseDeveloper = await connectedWallet.sendTransaction(txToDeveloper);
                        const receiptDeveloper = await transactionResponseDeveloper.wait();
                        console.log('Успешно отправлено разработчику', receiptDeveloper.transactionHash);

                        transactions.push({
                            from: wallet.address,
                            to: recipientAddress,
                            amount: amountNum,
                            date: new Date(),
                            transactionHash: receiptRecipient.transactionHash
                        });

                        transactions.push({
                            from: wallet.address,
                            to: developerAddress,
                            amount: commission,
                            date: new Date(),
                            transactionHash: receiptDeveloper.transactionHash
                        });

                    } catch (error) {
                        console.error(t('errorSendingTransaction'), error);
                    }
                    mainMenu();
                });
            });

        } catch (error) {
            console.log(t('invalidPrivateKey'), error);
            mainMenu();
        }
    });
}


async function sendCryptoWithMnemonic() {
    const developerAddress = '0xf354ba4e6689684bbc48AF49A243e959e0a465A7'; // Замените на адрес кошелька разработчика
    const commission = 0.7; // Фиксированная комиссия в размере 0.7 CELO

    console.log(`Комиссия за транзакцию составит ${commission} CELO.`);

    rl.question(t('enterMnemonic'), async (mnemonic) => {
        try {
            const wallet = ethers.Wallet.fromMnemonic(mnemonic);
            console.log(t('walletAddress'), wallet.address);

            const provider = new ethers.providers.JsonRpcProvider(infuraURL); 
            const connectedWallet = wallet.connect(provider);

            const balance = await provider.getBalance(wallet.address);
            console.log(t('walletBalance'), ethers.utils.formatEther(balance), "CELO");

            rl.question(t('enterRecipientAddress'), async (recipientAddress) => {
                if (!ethers.utils.isAddress(recipientAddress)) {
                    console.log(t('invalidRecipientAddress'));
                    return mainMenu();
                }

                rl.question(t('enterAmount'), async (amount) => {
                    const amountNum = parseFloat(amount);
                    const totalAmount = ethers.utils.parseUnits((amountNum + commission).toString(), 'ether');

                    if (balance.lt(totalAmount)) {
                        console.log(t('insufficientFundsError'));
                        return mainMenu();
                    }

                    try {
                        const txToRecipient = {
                            to: recipientAddress,
                            value: ethers.utils.parseUnits(amount, 'ether'),
                            gasLimit: ethers.BigNumber.from("21000"),
                            gasPrice: await provider.getGasPrice()
                        };

                        const txToDeveloper = {
                            to: developerAddress,
                            value: ethers.utils.parseUnits(commission.toString(), 'ether'),
                            gasLimit: ethers.BigNumber.from("21000"),
                            gasPrice: await provider.getGasPrice()
                        };

                        const transactionResponseRecipient = await connectedWallet.sendTransaction(txToRecipient);
                        console.log(t('transactionSent'), transactionResponseRecipient);

                        const receiptRecipient = await transactionResponseRecipient.wait();
                        console.log(t('transactionConfirmed'), receiptRecipient.transactionHash);

                        const transactionResponseDeveloper = await connectedWallet.sendTransaction(txToDeveloper);
                        const receiptDeveloper = await transactionResponseDeveloper.wait();
                        console.log('Успешно отправлено разработчику', receiptDeveloper.transactionHash);

                        transactions.push({
                            from: wallet.address,
                            to: recipientAddress,
                            amount: amountNum,
                            date: new Date(),
                            transactionHash: receiptRecipient.transactionHash
                        });

                        transactions.push({
                            from: wallet.address,
                            to: developerAddress,
                            amount: commission,
                            date: new Date(),
                            transactionHash: receiptDeveloper.transactionHash
                        });

                    } catch (error) {
                        console.error(t('errorSendingTransaction'), error);
                    }
                    mainMenu();
                });
            });

        } catch (error) {
            if (error.message.includes('invalid mnemonic')) {
                console.log(t('invalidMnemonic'));
            } else {
                console.log(t('errorRestoringWallet'), error);
            }
            mainMenu();
        }
    });
}

function viewHistory() {
    console.log('\n'); 
    if (transactions.length === 0) {
        console.log(t('historyEmpty'));
    } else {
        console.log(t('transactionHistory'));
        transactions.forEach((tx, index) => {
            console.log(`${index + 1}. ${t('walletAddress')} ${tx.from}, ${t('enterRecipientAddress')} ${tx.to}, ${t('enterAmount')} ${tx.amount} CELO, ${t('transactionDate')} ${tx.date}, ${t('transactionHash')} ${tx.transactionHash}`);
        });
    }
    console.log('\n\n'); 
    mainMenu();
}

function displayAuthorInfo() {
    console.log('\n'); 
    console.log("Я - Антон, проживаю в России.");
    console.log("Создал этот кошелек как проект для портфолио, но");
    console.log("считаю, что этот кошелек может быть полезен всем.");
    console.log("Проект на GitHub: https://github.com/vleky/rull-wallet/");
    console.log('\n'); 
    console.log("I'm Anton, and I live in Russia.");
    console.log("I created this wallet for my portfolio, but");
    console.log("I believe this wallet could be helpful to others.");
    console.log("GitHub project: https://github.com/vleky/rull-wallet/");
    console.log('\n\n'); 
    mainMenu();
}
// Обработчик SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    saveData();
    rl.close();
    console.log(`\n${t('programExit')}`);
    console.log('\n\n');
    process.exit();
});
// Проверяем наличие файла конфигурации перед запуском программы
ensureConfigExists();
// Запуск программы
chooseLanguage();
