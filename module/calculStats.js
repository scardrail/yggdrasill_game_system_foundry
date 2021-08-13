export function setExtraCaracs(data){    
    console.log(data);

    data = setTempersModifications(data);    
    data = setRollableStats(data);
    
    if(data.data.data.conflict.offensive.roll >=10){
        data.data.data.actions.max = 3;
    }

    data.data.data.actions.modifier = data.data.data.actions.value * -3;
    
    return data;
}
export function setTempersModifications(data){
    data.tempers.forEach(temper => {
        for(var i = 0; i <= temper.data.nbCaracUp; i++){
            console.log(temper.data.caracUp);
            if (i == 1 ){
                if(temper.data.caracUp.name == "conflict" || temper.data.caracUp.name == "mystic"){
                    data.data.data[temper.data.caracUp.name].offensive.mod += temper.data.caracUp.modifier;
                    data.data.data[temper.data.caracUp.name].defensive.mod += temper.data.caracUp.sndModifier;
                }else{
                    data.data.data[temper.data.caracUp.name].mod += temper.data.caracUp.modifier;
                }
            }
            if (i == 2 ){
                if(temper.data.sndCaracUp.name == "conflict" || temper.data.sndCaracUp.name == "mystic"){
                    data.data.data[temper.data.sndCaracUp.name].offensive.mod += temper.data.sndCaracUp.modifier;
                    data.data.data[temper.data.sndCaracUp.name].defensive.mod += temper.data.sndCaracUp.sndModifier;
                }else{
                    data.data.data[temper.data.sndCaracUp.name].mod += temper.data.sndCaracUp.modifier;
                }
            }
            if (i == 3 ){
                if(temper.data.thrdCaracUp.name == "conflict" || temper.data.thrdCaracUp.name == "mystic"){
                    data.data.data[temper.data.thrdCaracUp.name].offensive.mod += temper.data.thrdCaracUp.modifier;
                    data.data.data[temper.data.thrdCaracUp.name].defensive.mod += temper.data.thrdCaracUp.sndModifier;
                }else{
                    data.data.data[temper.data.thrdCaracUp.name].mod += temper.data.thrdCaracUp.modifier;
                }
            }
        }
    });
        
    return data;
}

export function setRollableStats(data){
    for (const [key, value] of Object.entries(data.config.extraCarac)){
        if(!(key == 'none' || key == 'dmgMod')){
            if(!(key =='conflict' || key =='mystic')){
                data.data.data[key].roll =  data.data.data[key].value + data.data.data[key].mod
            }else{
                data.data.data[key].offensive.roll =  data.data.data[key].offensive.value + data.data.data[key].offensive.mod
                data.data.data[key].defensive.roll =  data.data.data[key].defensive.value + data.data.data[key].defensive.mod
            }
        }
    };
    return data;
}
