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
let api = ApiConnector.getStocks(data => {
    if (data.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(data.data);
    }
})

setInterval(api, 3000);


// Операции с деньгами
const moneyManager = new MoneyManager();
// Реализуйте пополнение баланса
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        return response.success === true ? ProfileWidget.showProfile(response.data) &&
            moneyManager.setMessage(response.success, response.error) : moneyManager.setMessage(response.success, response.error);
    })
};

//Реализуйте конвертирование валюты
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        return response.success === true ? ProfileWidget.showProfile(response.data) &&
            moneyManager.setMessage(response.success, response.error) : moneyManager.setMessage(response.success, response.error);
    })

};

// Реализуйте перевод валюты
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        return response.success === true ? ProfileWidget.showProfile(response.data) &&
            moneyManager.setMessage(response.success, response.error) : moneyManager.setMessage(response.success, response.error);
    })
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
        return response.success === true ? favoritesWidget.clearTable() &&
            moneyManager.updateUsersList(response) &&
            moneyManager.setMessage(response.success, response.error) : moneyManager.setMessage(response.success, response.error);
    })
};

// Реализуйте удаление пользователя из избранного
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        return response.success === true ? moneyManager.setMessage(response.success, response.error) : moneyManager.setMessage(response.success, response.error);
    })
}