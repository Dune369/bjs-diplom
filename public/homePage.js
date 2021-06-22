// Выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(callback => {
        if (callback.success) {
            location.reload();
        }
    })
};

// Получение информации о пользователе
ApiConnector.current(data => {
    if (data.success) {
        ProfileWidget.showProfile(data.data);
    }
})

// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

ApiConnector.getStocks(data => {
    if (data.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(data.data)
        return setInterval(() => {
            ratesBoard.clearTable();
            ratesBoard.fillTable(data.data)
        }, 60000);
    }
})

// Операции с деньгами
const moneyManager = new MoneyManager();
// Реализуйте пополнение баланса
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(data.currency && data.amount, 'Успешно!')
        }
    })
    moneyManager.setMessage(data.currency && data.amount, 'Заполните данные!')
};

//Реализуйте конвертирование валюты
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(data.fromCurrency && data.targetCurrency && data.fromAmount, 'Успешно!')
        }
    })
    moneyManager.setMessage(data.fromCurrency && data.targetCurrency && data.fromAmount, 'Заполните данные!')
};

// Реализуйте перевод валюты
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(data.to && data.currency && data.amount, 'Успешно!')
        }
    })
    moneyManager.setMessage(data.to && data.currency && data.amount, 'Заполните данные!')
};

// Операции с деньгами
// Запросите начальный список избранного
const favoritesWidget = new FavoritesWidget()
ApiConnector.getFavorites((data) => {
    if (data.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(data.data);
        moneyManager.updateUsersList(data.data);
    }
    
    
})

// Реализуйте добавления пользователя в список избранных
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            moneyManager.updateUsersList(response);
            moneyManager.setMessage(data.id && data.name, 'Успешно!')
        }
    })
    moneyManager.setMessage(data.id && data.name, 'Заполните данные!')
};


// Реализуйте удаление пользователя из избранного
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            moneyManager.setMessage(data, 'Успешно!')
        }
    })
    moneyManager.setMessage(data, 'Заполните данные!')
}