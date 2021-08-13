export function setExtraCaracs(data){    
    if(data.data.data.conflict.offensive >=10){
        data.data.data.actions.max = 3;
    }

    data.data.data.actions.modifier = data.data.data.actions.value * -3;
    

    data.tempers.forEach(temper => {
        for(var i = 0; i <= temper.data.nbCaracUp; i++){
            console.log(i);
            if (i == 1 ){
                if(temper.data.caracUp.name == "conflict" || temper.data.caracUp.name == "mystic"){
                    data.data.data[temper.data.caracUp.name].offensive += temper.data.caracUp.modifier;
                    data.data.data[temper.data.caracUp.name].defensive += temper.data.caracUp.sndModifier;
                }else{
                    data.data.data[temper.data.caracUp.name] += temper.data.caracUp.modifier;
                }
            }
            if (i == 2 ){
                if(temper.data.sndCaracUp.name == "conflict" || temper.data.sndCaracUp.name == "mystic"){
                    data.data.data[temper.data.sndCaracUp.name].offensive += temper.data.sndCaracUp.modifier;
                    data.data.data[temper.data.sndCaracUp.name].defensive += temper.data.sndCaracUp.sndModifier;
                }else{
                    data.data.data[temper.data.sndCaracUp.name] += temper.data.sndCaracUp.modifier;
                }
            }
            if (i == 3 ){
                if(temper.data.thrdCaracUp.name == "conflict" || temper.data.thrdCaracUp.name == "mystic"){
                    data.data.data[temper.data.thrdCaracUp.name].offensive += temper.data.thrdCaracUp.modifier;
                    data.data.data[temper.data.thrdCaracUp.name].defensive += temper.data.thrdCaracUp.sndModifier;
                }else{
                    data.data.data[temper.data.thrdCaracUp.name] += temper.data.thrdCaracUp.modifier;
                }
            }
        }
            
    });
    
    return data;
}
