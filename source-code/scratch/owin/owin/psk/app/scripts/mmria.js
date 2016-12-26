var $mmria = function() 
{
    return {
        generate_record_id : function f(x) 
        {
            if 
            (
                (!x.value || x.value == '') && 
                (
                    this.state_of_death_record &&
                    this.state_of_death_record != '' &&
                    this.date_of_death &&
                    this.date_of_death != 0
                )
            ) 
            {
                x.value = this.state_of_death_record + '-' + this.date_of_death.year + '-' + Math.random().toString().substring(2, 6);
            }
        },
        compose : function() 
        {
            //http://stackoverflow.com/questions/28821765/function-composition-in-javascript
            var funcs = arguments;

            return function() {
                var args = arguments;
                for (var i = funcs.length; i > 0; i--) {
                    args = [funcs[i].apply(this, args)];
                }
                return args[0];
                // var c = compose(trim, capitalize);
            }
        }


    };

}();

