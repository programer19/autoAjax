        $.fn.autoAjax = function(method, options){
            if(!method){
                
                var self = this;
                var protoObject = {
                    _selector: null,
                    
                    _handlers : {},
                    _actFunc: null,
                    
                    addHandlers: function(callbacks){
                        for (var name in callbacks){
                            this._handlers[name] = callbacks[name];
                        }
                    },
                    removeHandler: function(name){
                        delete this._handlers[name];
                    },
                    resetHandlers: function(){
                        this._handlers = {};
                    },
                    setSuccess: function(name){
                        self.attr('data-success', name);
                    },
                    setError: function(name){
                        self.attr('data-error', name);
                    },
                    remove: function(){
                        if(this._selector){
                            $('body').off('submit', this._selector, this._actFunc);
                            delete $.fn.autoAjax._instances[this._selector];
                        }else{
                            $(this._selector).off('submit', this._actFunc);
                            $(this).data('autoAjax', null);
                        }
                    }
                };
                
                protoObject._actFunc = function(e){
                    e.preventDefault();
                    var frm = $(this);

                    $.ajax({
                        url: frm.attr('action'),
                        type: frm.attr('method'),
                        data: frm.serialize(),
                        success: protoObject._handlers[frm.attr('data-success') || 'defaultSuccess'] || function(data){
                            console.log(data);
                        },
                        error: protoObject._handlers[frm.attr('data-error') || 'defaultError'] || function(error){
                            console.log(error);
                        }
                    });
                };
                
                
                if(this.selector){
                    protoObject._selector = this.selector;
                    $('body').on('submit', this.selector, protoObject._actFunc);
                    $.fn.autoAjax._instances[this.selector] = protoObject;
                }else if(this.length>1){
                    this.each(function(){
                        $(this).on('submit', protoObject._actFunc);
                        $(this).data('autoAjax', protoObject); 
                    });
                }else if(this.length===1){
                    this.on('submit', protoObject._actFunc);
                    this.data('autoAjax', protoObject);
                }
                
                return this;
            }else{
                if(this.selector){
                    if ($.fn.autoAjax._instances[this.selector]){
                        $.fn.autoAjax._instances[this.selector][method](options);
                    }
                    return this;
                }else{
                    this.each(function(){
                        if(!$(this).data('autoAjax')) $(this).autoAjax();
                        $(this).data('autoAjax')[method](options);
                    });
                }
            }
        };
        $.fn.autoAjax._instances = {};
