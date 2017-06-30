var CurseType = {
    BOARD_GROW:    {value: 1, name: 'Board growth', marquee: ''},
    MORE_COLORS:   {value: 2, name: 'Colors everywhere', marquee: ''},
    REVERSE_KEYS:  {value: 3, name: 'Reverse keys', marquee: ''},
    THUNDERSTORM:  {value: 4, name: 'Thunderstorm', marquee: ''},
    BROWN_OUT:     {value: 5, name: 'Brown Out', marquee: ''},
    WHITE_OUT:     {value: 6, name: 'White Out', marquee: ''},
    SUPER_LONG:    {value: 7, name: 'Super Long', marquee: ''}

    random: function() {
      var type = game.rnd.pick([
        this.BOARD_GROW
      ]);

      return type;
    }
}
