var HighScore = {

    get: function() {
      var highScore = localStorage.getItem('colors.highScore');
      if (!highScore) {
        localStorage.setItem('colors.highScore', 0);
        highScore = 0;
      }
      return highScore;
    },

    set: function(score) {
      localStorage.setItem('colors.highScore', score);
    }

}
