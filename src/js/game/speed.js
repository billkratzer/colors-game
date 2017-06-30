var GameSpeed = {

    speeds: [
      1000,   // Level 1
       800,   // Level 2
       600,   // Level 3
       400,   // Level 4
      5000,   // Level 5
      1000,   // Level 6
      1000,   // Level 7
      1000,   // Level 8
      1000,   // Level 9
       900,   // Level 10
       800,   // Level 11
       700,   // Level 12
       600,   // Level 13
       500,   // Level 14
       500,   // Level 15
    ],

    getSpeedForLevel: function(level) {
      if (level <= 15) {
        return this.speeds[level - 1];
      }
      else {
        return 400;
      }
    }

}
