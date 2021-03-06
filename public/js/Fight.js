MultApp.Fight = function (game) {
}

MultApp.Fight.prototype = {
    problem: function(index) {
        game.add.sprite(0, 0, 'bgGrass');
        
        menuButton();
        
	var goldLabels = showGold();
	var goldLabel = goldLabels[0];
	var coinIcon = goldLabels[1];
        var monster = this.renderMonster();
        
        game.physics.arcade.gravity.y = 0;
	
        problem = MultApp.tableRandom[index];
        firstFactor = problem[0];
        secondFactor = problem[1];
        product = problem[2];

        var problemLabel = game.add.text(0, 80, String(firstFactor) + 'X' + String(secondFactor), {font: '40px Open Sans', fill: '#000'});
        problemLabel.x = (game.world.width - problemLabel.width) / 2;

	var answerInputRaw = '<form id="answerForm" onSubmit="return false;">' +
	    '<input type="text" id="answer" name="answer">' +
	    '</input>' +
	    '</form>';
	
        $('#input').html(answerInputRaw);
	$('#answer').focus();
        $('#answerForm').submit(function(event) {
	    if (MultApp.Fight.prototype.checkAnswer(index, $('#answer').val())) {
                MultApp.Fight.prototype.problemCorrect(index, problemLabel, monster, goldLabel, coinIcon);
	    } else {
	        MultApp.Fight.prototype.endProblem(index, problemLabel, monster, goldLabel, coinIcon);
            }
        });
    },

    checkAnswer: function(index, answer) {
	problem = MultApp.tableRandom[index];
        product = problem[2];

	return (product == answer);
    },

    renderMonster: function() {
        var monster = game.add.sprite(0, 140, monsters[MultApp.save.monsterActive].key);
        monster.scale.setTo(monsters[MultApp.save.monsterActive].scale);
        monster.x = (game.world.width - monster.width) / 2
        
        game.physics.arcade.enable(monster);

        return monster;
    },

    defeatMonster: function(index, problemLabel, monster, goldLabel, coinIcon) {
        game.physics.arcade.gravity.y = 600;
        monster.checkWorldBounds = true;

        this.index = index;
        this.problemLabel = problemLabel;
        this.monster = monster;
        this.goldLabel = goldLabel;
        this.coinIcon = coinIcon;
        this.defeated = true;
        monster.events.onOutOfBounds.addOnce(this.endProblemDefeated, this);
    },
    
    problemCorrect: function(index, problemLabel, monster, goldLabel, coinIcon) {
        MultApp.save.gold += 5;
        this.defeatMonster(index, problemLabel, monster, goldLabel, coinIcon);
    },

    endProblem: function(index, problemLabel, monster, goldLabel, coinIcon) {
        if (index+1 < MultApp.tableRandom.length) {
            problemLabel.destroy();
            monster.destroy();
	    goldLabel.destroy();
	    coinIcon.destroy();
            this.problem(index+1);
        }
    },
    
    endProblemDefeated: function() {
        if (this.index+1 < MultApp.tableRandom.length) {
            this.problemLabel.destroy();
            this.monster.destroy();
	    this.goldLabel.destroy();
	    this.coinIcon.destroy();
            this.problem(this.index+1);
        }
    },
    
    create: function() {
        MultApp.tableFlattened = [];
        
        for (i = 0; i < MultApp.table.length; i++) {
            for (j = 0; j < MultApp.table[0].length; j++) {
                MultApp.tableFlattened.push(MultApp.table[i][j]);
            }
        }
        MultApp.tableRandom = _.shuffle(MultApp.tableFlattened);

        $('#input').html('');

        this.problem(0);
    }
}

game.state.add('Fight', MultApp.Fight);
