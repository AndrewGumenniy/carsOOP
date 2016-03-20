	function Car(element) {
		this.element = element;
		var badRoadBehaviourflag;
		
		this.moveForward =function(interval){
			element.style.left=parseInt(window.getComputedStyle(this.element).left) + interval +"px";	
		};
		//положение машинки
		Object.defineProperty(this, "position", {
			get: function() {
				return parseInt(window.getComputedStyle(this.element).left);
			}
		});
		//длина машинки
		Object.defineProperty(this, "width", {
			get: function() {
				return parseInt(window.getComputedStyle(this.element).width);
			}
		});
		
		//повдение машинки на плохой дороге
		this.badRoadBehaviour=function(){
			if(badRoadBehaviourflag){
				element.classList.remove("rotate-2");
				element.classList.add("rotate-1");
				badRoadBehaviourflag = false;
			}else{
				element.classList.remove("rotate-1");
				element.classList.add("rotate-2");
				badRoadBehaviourflag = true;
			}
		}
		//очистка поведения
		this.clearBehaviour=function(){
			element.classList.remove("rotate-2");
			element.classList.remove("rotate-1");
		}
	}
	
	function Road(element, badroad, roadstop) {
		this.element = element;
		this.badroad=badroad;
		this.roadstop=roadstop;
				
		//ширина дороги
		this.roadWidth=parseInt(window.getComputedStyle(this.element).width);
		
		//координаты плохой дороги
		this.badRoadWith=parseInt(window.getComputedStyle(this.badroad).width);
		this.badRoadWithRight = badroad.getBoundingClientRect().right;
		this.badRoadWithLeft = badroad.getBoundingClientRect().left;
		
		if(this.badRoadWithLeft){
			this.badRoadPosLeft = this.badRoadWithLeft;
			this.badRoadPosRight = this.badRoadWith+this.badRoadWithLeft;
		}
		else{
			this.badRoadPosLeft = this.roadWidth-this.badRoadWith-this.badRoadWithRight;
			this.badRoadPosRight = this.roadWidth-this.badRoadWithRight;
		}
		//координаты препятствия
		if(this.roadstop!=undefined){
			this.badRoadStop = roadstop.getBoundingClientRect().left;
		}
	}

	function World(element, car, road){
		this.element = element;
		this.road = road;
		this.car= car;
						
		element.addEventListener('click', function(e){
			var interval = 120;
			//движение машины вперед
			if ((e.pageX-car.position)>car.width/2) {
				//проверка на препятствие
				if (car.position+car.width+interval>road.badRoadStop) {
					console.log(road.badRoadStop);
					//препятствие+плохая дорога
					if(car.position<road.badRoadPosRight&&car.position+car.width+interval/5<road.badRoadStop){
						car.moveForward(interval/5);
						car.badRoadBehaviour();
					}
					else{
						car.clearBehaviour();
						car.moveForward(road.badRoadStop-(car.position+car.width));
					}
				}else{
					if((car.position+car.width+interval)<road.roadWidth){
						if(car.position+car.width>road.badRoadPosLeft&&car.position+car.width/4<road.badRoadPosRight){
							car.moveForward(interval/5);
							car.badRoadBehaviour();
						}else{
							car.clearBehaviour();
							car.moveForward(interval);							
						}
					}else{
						if(car.position<road.badRoadPosRight&&car.position+car.width+interval/5<road.roadWidth){
							car.moveForward(interval/5);
							car.badRoadBehaviour();
						}else{
							car.clearBehaviour();
							car.moveForward(road.roadWidth-(car.position+car.width));				
						}
					}	
				}	
			}
			//движение машины назад		
			if((e.pageX-car.position)<car.width/2&&car.position>0){	
				if(car.position<road.badRoadPosRight&&car.position+car.width*0.75>road.badRoadPosLeft){
					car.moveForward(-interval/5);
					car.badRoadBehaviour();
				}
				else{
					car.clearBehaviour();
					car.moveForward(-interval);
				}
				if(car.position<interval){
					car.clearBehaviour();
					car.moveForward(-(interval-(interval-car.position)));
				}
			}
		})
	}
	
	var selectorRoad = document.querySelectorAll(".road");
	var selectorBadRoad = document.querySelectorAll(".bad-road");

	var sedan = new Car(document.querySelector(".car-sedan"));
	var road1 = new Road(selectorRoad[0],selectorBadRoad[0]);
	var world1 = new World(selectorRoad[0],sedan,road1);
	
	var truck = new Car(document.querySelector(".car-truck"));
	var road2 = new Road(selectorRoad[1],selectorBadRoad[1]);
	var world2 = new World(selectorRoad[1],truck,road2);
	
	var beetle  = new Car(document.querySelector(".car-beetle"));
	var road3 = new Road(selectorRoad[2],selectorBadRoad[2],document.querySelector(".road-stop"));
	var world3 = new World(selectorRoad[2],beetle,road3);