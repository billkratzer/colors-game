var CurseType = {
    BOARD_GROW:    { value: 1, name: 'The ever growing board', marquee: Marquees.CURSED_BOARD_GROW },
    CURSED_COLORS: { value: 2, name: 'Cursed Colors', marquee: Marquees.CURSED_COLORS  },
    REVERSE_KEYS:  { value: 3, name: 'Reverse Keys', marquee: Marquees.REVERSE_KEYS },
    
    THUNDERSTORM:  { value: 4, name: 'Thunderstorm' },
    BROWN_OUT:     { value: 5, name: 'Brown Out' },
    WHITE_OUT:     { value: 6, name: 'White Out' },
    SUPER_LONG:    { value: 7, name: 'Super Long' },
    
    HARDER_MATCHES:{ value: 9, name: 'Match 4', marquee: Marquees.HARDER_MATCHES },
    random: function() {
      var type = game.rnd.pick([
        this.BOARD_GROW,
        this.CURSED_COLORS,
        this.REVERSE_KEYS,
        this.HARDER_MATCHES,
      ]);
      return type;
    }

}
