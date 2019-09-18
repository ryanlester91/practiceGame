/*
    Shared between server and client.
    In this example, `item` is always of type game_player.
*/
game_core.prototype.check_collision = function( item ) {

    //Left wall.
if(item.pos.x <= item.pos_limits.x_min) {
    item.pos.x = item.pos_limits.x_min;
}

    //Right wall
if(item.pos.x >= item.pos_limits.x_max ) {
    item.pos.x = item.pos_limits.x_max;
}

    //Roof wall.
if(item.pos.y <= item.pos_limits.y_min) {
    item.pos.y = item.pos_limits.y_min;
}

    //Floor wall
if(item.pos.y >= item.pos_limits.y_max ) {
    item.pos.y = item.pos_limits.y_max;
}

    //Fixed point helps be more deterministic
item.pos.x = item.pos.x.fixed(4);
item.pos.y = item.pos.y.fixed(4);

}; //game_core.check_collision