$("#menubtn").live('click', function(e){
	//if ($("#scs").css('display') == 'inline-block'){
	//	$("#scs").css('display', 'none');
	//	$("#scs").removeAttr('style');
	//}else{
	//	$("#scs").css('display', 'inline-block');
	//}
	
	if ($("#scs").hasClass('comeBack')){
		$("#scs").removeClass('comeBack');
		$("#scs").addClass('goAway');
	}else{
		$("#scs").removeClass('goAway');
		$("#scs").addClass('comeBack');
	}
	return false;
});

var initGraphMenu =(function() {


	var graphMenuWidth =  $('#graph-menu').width() + 10;
	graphMenuWidth = -graphMenuWidth;

	$('#graph-menu').css("right", graphMenuWidth);
	
	$(".tab").click(function(e) {
		$(".tab").removeClass('selected');
		$(".tab_content").removeClass('active');
		
		$(this).addClass('selected');
		
		
		var modID = "#" + $(this).attr("id") + "_content";
		$(modID).addClass('active');
		
		
		
	})

	$(".btnmenu.external").click(function(e) {
		$('#graph-menu').animate({right: '0'});
	});
	
	$(".btnmenu.internal").click(function(e) {
		$('#graph-menu').animate({right: graphMenuWidth});
	});
	
});



$("#scs li h2 a").live('click', function(e){
	//$(".menu-section").css('display', 'none');
	$("#scs li").removeClass('active');
	$("#scs li .menu-section").removeClass('comeBack');
	
	//if($("#scs li .menu-section").hasClass('comeBack') ){
	if($(this).parentsUntil( "li" ).find(".menu-section").hasClass('comeBack') ){
		console.log( $(this).closest("li").find(".menu-section").attr('id') );
		$(this).closest("li").find(".menu-section").addClass('goAway');
		$(this).closest("li").find(".menu-section").removeClass('comeBack');
	}else {
		$(this).closest("li").find(".menu-section").removeClass('goAway');
		$(this).closest("li").find(".menu-section").addClass('comeBack');
		$(this).closest("li").addClass('active');		
	}
	return false;
});

