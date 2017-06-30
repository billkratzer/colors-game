var CurseType = {
    BOARD_GROW:    { value: 1, name: 'The ever growing board', marquee: Marquees.CURSED_BOARD_GROW },
    MORE_COLORS:   { value: 2, name: 'Colors everywhere' },
    REVERSE_KEYS:  { value: 3, name: 'Reverse keys' },
    THUNDERSTORM:  { value: 4, name: 'Thunderstorm' },
    BROWN_OUT:     { value: 5, name: 'Brown Out' },
    WHITE_OUT:     { value: 6, name: 'White Out' },
    SUPER_LONG:    { value: 7, name: 'Super Long' },

    random: function() {
      var type = game.rnd.pick([
        this.BOARD_GROW
      ]);

      return type;
    }

}
