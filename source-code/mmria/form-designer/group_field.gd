extends Node2D


@export var width:float = 20
@export var height:float = 10
@export var top:float = 20
@export var left:float = 20

@export var color:Color = Color.BLUE

var TopLeftHandleBar:HandleBar
var BottomRightHandleBar:HandleBar

var start:Vector2 = Vector2.ZERO
var end:Vector2 = Vector2.ZERO

func _ready():
	TopLeftHandleBar = $TopLeftHandleBar
	BottomRightHandleBar = $BottomRightHandleBar
	_calc_positions()
	TopLeftHandleBar.position = start
	BottomRightHandleBar.position = end

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func _calc_positions():
	var x_diff = abs(position.x - width / 2)
	var y_diff = abs(position.y - width / 2)
	start = Vector2(position.x - x_diff, position.y - y_diff)
	end = Vector2(position.x + x_diff, position.y + y_diff)

func _draw():
	var point_array:PackedVector2Array
	point_array.append(start)
	point_array.append(Vector2(end.x, start.y))
	point_array.append(Vector2(start.x, end.y))
	point_array.append(end)
	#raw_line(point_array[0], point_array[3], Color.BLUE)
	
	draw_line(point_array[0], point_array[1], color)
	draw_line(point_array[0], point_array[2], color)
	draw_line(point_array[2], point_array[3], color)
	draw_line(point_array[3], point_array[1], color)
