var GameSpeed = {

    speeds: [
      1000,   // Level 1
      800,   // Level 2
      900,   // Level 3
      700,   // Level 4
      800,   // Level 5
      700,   // Level 6
      800,   // Level 7
    ],

    getSpeedForLevel: function(level) {
      
      if (level <= this.speeds.length) {
        return this.speeds[level - 1];
      }
      else {
        // when we stop using the pre determined speeds, 
        // each level increases the speed by 30 until it hits 30
        // at about lv 33 will it reach max speed
        let maxSpd = 800-((level-this.speeds.length)*30);
        return (maxSpd<30)?30:maxSpd
      }
    }

}
