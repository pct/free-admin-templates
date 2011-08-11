/*
 * UPDATED: 12.19.07
 *
 * jNice
 * by Sean Mooney (sean@whitespace-creative.com) 
 *
 * To Use: place in the head 
 *  <link href="inc/style/jNice.css" rel="stylesheet" type="text/css" />
 *  <script type="text/javascript" src="inc/js/jquery.jNice.js"></script>
 *
 * And apply the jNice class the form you want to style
 *
 * To Do: Add textareas, Add File upload
 *
 ******************************************** */
(function($){
	$.fn.jNice = function(options){
		var self = this;
		var safari = $.browser.safari; /* We need to check for safari to fix the input:text problem */
	
		/* each form */
		this.each(function(){
			/***************************
			  Buttons
			 ***************************/
			 var setButton = function(){
				$(this).replaceWith('<button id="'+ this.id +'" name="'+ this.name +'" type="'+ this.type +'" class="'+ this.className +'"><span><span>'+ $(this).attr('value') +'</span></span>');
			};
			$('input:submit, input:reset', this).each(setButton); 
			
			/***************************
			  Text Fields 
			 ***************************/
			/* var setText = function(){
				var $input = $(this);
				$input.addClass("jNiceInput").wrap('<div class="jNiceInputWrapper"><div class="jNiceInputInner"><div></div></div></div>');
				var $wrapper = $input.parents('div.jNiceInputWrapper');
				$wrapper.css("width", $(this).width()+10);
				$input.focus(function(){
					$wrapper.addClass("jNiceInputWrapper_hover");
				}).blur(function(){
					$wrapper.removeClass("jNiceInputWrapper_hover");
				});
			};
			$('input:text:visible, input:password', this).each(setText);
			if (safari){$('.jNiceInputWrapper').each(function(){$(this).addClass('jNiceSafari').find('input').css('width', $(this).width()+11);});} */
			
			/***************************
			  Check Boxes 
			 ***************************/
			$('input:checkbox', this).each(function(){
				$(this).addClass('jNiceHidden').wrap('<span></span>');
				var $wrapper = $(this).parent();
				$wrapper.prepend('<a href="#" class="jNiceCheckbox"></a>');
				/* Click Handler */
				$(this).siblings('a.jNiceCheckbox').click(function(){
						var $a = $(this);
						var input = $a.siblings('input')[0];
						if (input.checked===true){
							input.checked = false;
							$a.removeClass('jNiceChecked');
						}
						else {
							input.checked = true;
							$a.addClass('jNiceChecked');
						}
						return false;
				});
				/* set the default state */
				if (this.checked){$('a.jNiceCheckbox', $wrapper).addClass('jNiceChecked');}
			});
			
			/***************************
			  Radios 
			 ***************************/
			$('input:radio', this).each(function(){
				$input = $(this);
				$input.addClass('jNiceHidden').wrap('<span class="jRadioWrapper"></span>');
				var $wrapper = $input.parent();
				$wrapper.prepend('<a href="#" class="jNiceRadio" rel="'+ this.name +'"></a>');
				/* Click Handler */
				$('a.jNiceRadio', $wrapper).click(function(){
						var $a = $(this);
						$a.siblings('input')[0].checked = true;
						$a.addClass('jNiceChecked');
						/* uncheck all others of same name */
						$('a[rel="'+ $a.attr('rel') +'"]').not($a).each(function(){
							$(this).removeClass('jNiceChecked').siblings('input')[0].checked=false;
						});
						return false;
				});
				/* set the default state */
				if (this.checked){$('a.jNiceRadio', $wrapper).addClass('jNiceChecked');}
			});
	
			
			/***************************
			  Selects 
			 ***************************/
			$('select', this).each(function(index){
				var $select = $(this);
				/* First thing we do is Wrap it */
				$(this).addClass('jNiceHidden').wrap('<div class="jNiceSelectWrapper"></div>');
				var $wrapper = $(this).parent().css({zIndex: 100-index});
				/* Now add the html for the select */
				$wrapper.prepend('<div><span></span><a href="#" class="jNiceSelectOpen"></a></div><ul></ul>');
				var $ul = $('ul', $wrapper);
				/* Now we add the options */
				$('option', this).each(function(i){
					$ul.append('<li><a href="#" index="'+ i +'">'+ this.text +'</a></li>');
				});
				/* Hide the ul and add click handler to the a */
				$ul.hide().find('a').click(function(){
						$('a.selected', $wrapper).removeClass('selected');
						$(this).addClass('selected');	
						/* Fire the onchange event */
						if ($select[0].selectedIndex != $(this).attr('index') && $select[0].onchange) { $select[0].selectedIndex = $(this).attr('index'); $select[0].onchange(); }
						$select[0].selectedIndex = $(this).attr('index');
						$('span:eq(0)', $wrapper).html($(this).html());
						$ul.hide();
						return false;
				});
				/* Set the defalut */
				$('a:eq('+ this.selectedIndex +')', $ul).click();
			});/* End select each */
			
			/* Apply the click handler to the Open */
			$('a.jNiceSelectOpen', this).click(function(){
														var $ul = $(this).parent().siblings('ul');
														if ($ul.css('display')=='none'){hideSelect();} /* Check if box is already open to still allow toggle, but close all other selects */
    													$ul.slideToggle();
														var offSet = ($('a.selected', $ul).offset().top - $ul.offset().top);
														$ul.animate({scrollTop: offSet});
														return false;
												});
		
		}); /* End Form each */
		
		/* Hide all open selects */
		var hideSelect = function(){
			$('.jNiceSelectWrapper ul:visible').hide();
		};
		
		/* Check for an external click */
		var checkExternalClick = function(event) {
			if ($(event.target).parents('.jNiceSelectWrapper').length === 0) { hideSelect(); }
		};

		/* Apply document listener */
		$(document).mousedown(checkExternalClick);
		
			
		/* Add a new handler for the reset action */
		var jReset = function(f){
			var sel;
			$('.jNiceSelectWrapper select', f).each(function(){sel = (this.selectedIndex<0) ? 0 : this.selectedIndex; $('ul', $(this).parent()).each(function(){$('a:eq('+ sel +')', this).click();});});
			$('a.jNiceCheckbox, a.jNiceRadio', f).removeClass('jNiceChecked');
			$('input:checkbox, input:radio', f).each(function(){if(this.checked){$('a', $(this).parent()).addClass('jNiceChecked');}});
		};
		
	};/* End the Plugin */

	/* Automatically apply to any forms with class jNice */
	$(function(){$('form.jNice').jNice();	});

})(jQuery);
				   
