MultApp.Shop = function(game) {
}

MultApp.Shop.prototype = {
    create: function() {
        $('#input').html('');

        menuButton();
        
        var goldLabels = showGold();
        var goldLabel = goldLabels[0];
        var coinIcon = goldLabels[1];

        this.renderMonsterListing(0, 60);
    },

    renderMonsterListing: function(key, y) {
        var monster = monsters[Object.keys(monsters)[key]];

        var monsterName = Object.keys(monsters)[key];
        var monsterNameCap = capitalizeFirstLetter(Object.keys(monsters)[key]);
        var cost = monster['cost'];

        var coinIcon = game.add.image(50, y, 'coin');
        var costLabel = game.add.text(85, y, String(cost), {font: '30px Open Sans'});
        var nameLabel = game.add.text(costLabel.x + costLabel.width + 20, y, monsterNameCap);

        if (MultApp.monstersOwned.indexOf(monsterName) > -1) {
            var ownedLabel = game.add.image(500, y, 'monsterOwned');
            if (MultApp.monsterActive == monsterName) {
                var selected = game.add.image(570, y, 'monsterSelected');
            } else {
                var selectButton = game.add.button(570, y, 'selectButton', undefined, undefined, undefined, 'selectButtonNormal', 'selectButtonPressed', undefined);
                selectButton.onInputUp.addOnce(this.selectMonster, {key: key});
            }
        } else {
            var ownedLabel = game.add.image(500, y, 'monsterNotOwned');
            var buyButton = game.add.button(570, y, 'buyButton', undefined, undefined, undefined, 'buyButtonNormal', 'buyButtonPressed', undefined);
            buyButton.onInputUp.addOnce(this.buyMonster, {key: key});
        }
        
        if (key+1 < _.size(monsters)) {
            this.renderMonsterListing(key+1, y+50);
        }
    },

    buyMonster: function(key) {
        console.log(Object.keys(monsters)[this.key]);
        MultApp.monstersOwned.push(Object.keys(monsters)[this.key]);
        game.state.start(game.state.current);
    },

    selectMonster: function(key) {
        MultApp.monsterActive = Object.keys(monsters)[this.key];
        game.state.start(game.state.current);
    }
}

game.state.add('Shop', MultApp.Shop);