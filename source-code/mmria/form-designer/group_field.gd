@tool
extends Node2D

@export var width:float = 40
@export var height:float = 20
@export var top:float = 20
@export var left:float = 20

@export var color:Color = Color.RED

var Area:Area2D
var CollisionShap:RectangleShape2D


var TopLeftHandleBar:HandleBar
var BottomRightHandleBar:HandleBar

var start:Vector2 = Vector2.ZERO
var end:Vector2 = Vector2.ZERO

func _enter_tree():

	#print("group field enter_tree")
	pass

func _ready():
	#print("group field ready")
	TopLeftHandleBar = $TopLeftHandleBar
	BottomRightHandleBar = $BottomRightHandleBar

	Area = $Area2D
	CollisionShap = $Area2D/CollisionShape2D.shape
	
	Area.connect("area_entered", _area_on_enter)
	Area.connect("area_exited", _area_on_exited)

	TopLeftHandleBar.connect("mouse_engaged", top_handle_bar_start)
	TopLeftHandleBar.connect("mouse_move", top_handle_bar_changed)
	TopLeftHandleBar.connect("mouse_disengaged", top_handle_bar_end)
	
	BottomRightHandleBar.connect("mouse_engaged", bottom_handle_bar_start)
	BottomRightHandleBar.connect("mouse_move", bottom_handle_bar_changed)
	BottomRightHandleBar.connect("mouse_disengaged", bottom_handle_bar_end)

	_calc_positions()
	
	TopLeftHandleBar.update_position(start)
	BottomRightHandleBar.update_position(end)
	
	CollisionShap.size = Vector2(width, height)
	
	
	
	queue_redraw()
	
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta):
	pass

func _calc_positions():
	var x_diff = width / 2.0
	var y_diff = height / 2.0
	start = Vector2(- x_diff, -y_diff)
	end = Vector2(x_diff, y_diff)

func _calc_resize(top_left:Vector2, bottom_right:Vector2):

	var _width = abs(top_left.x - bottom_right.x)
	var _height = abs(top_left.y - bottom_right.y)
	
	width = _width
	height = _height
	#var size_x = abs(top_left.x - bottom_right.x)
	#var size_y = abs(top_left.y - bottom_right.y)

	#Area.position = start - Vector2(size_x, size_y) /2
	CollisionShap.size = Vector2(_width, _height)
	
	_calc_positions()
	TopLeftHandleBar.update_position(start)
	BottomRightHandleBar.update_position(end)
	queue_redraw()
	

func _draw():
	var point_array:PackedVector2Array = []
	point_array.append(start)
	point_array.append(Vector2(end.x, start.y))
	point_array.append(end)
	point_array.append(Vector2(start.x, end.y))
	
	#raw_line(point_array[0], point_array[3], Color.BLUE)
	
	draw_line(point_array[0], point_array[1], color)
	draw_line(point_array[1], point_array[2], color)
	draw_line(point_array[2], point_array[3], color)
	draw_line(point_array[3], point_array[0], color)
	
	#draw_circle(Vector2.ZERO, 3, Color.ALICE_BLUE)

func _area_on_enter(_area: Area2D):
	#print("Lasso Area Enterd")
	pass
	
	
func _area_on_exited(_area: Area2D):
	#print("Lasso Area Exited")
	pass
	
	
func top_handle_bar_start(position:Vector2):
	print("top_handle_bar_start G:%s P:%s", get_global_mouse_position(), position)
	pass
	
func top_handle_bar_changed(position:Vector2):
	print("top_handle_bar_changed G:%s P:%s", get_global_mouse_position(), position)
	_calc_resize(to_local(position), BottomRightHandleBar.position)
	pass	
	
func top_handle_bar_end(position:Vector2):
	print("top_handle_bar_end G:%s P:%s", get_global_mouse_position(), position)
	pass
	
func bottom_handle_bar_start(position:Vector2):
	print("bottom_handle_bar_start G:%s P:%s", get_global_mouse_position(), position)
	pass

func bottom_handle_bar_changed(position:Vector2):
	print("bottom_handle_bar_changed G:%s P:%s", get_global_mouse_position(), position)
	_calc_resize(TopLeftHandleBar.position, to_local(position))
	
	pass
	
func bottom_handle_bar_end(position:Vector2):
	print("bottom_handle_bar_end G:%s P:%s", get_global_mouse_position(), position)
	pass
