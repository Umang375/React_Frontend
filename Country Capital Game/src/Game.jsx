import { useState,useEffect } from "react"
import _ from "lodash";
import "./Game.scss"
import classNames from "classnames";

const Game = ({data}) => {
    const[options, setOptions] = useState([]);
    const[selected, setSelected] = useState([]);
    const[correct, setCorrect] = useState([])

    // set => india and new delhi
    // set => russia and moscow => india,delhi,russia,moscow
    const [matched, setMatched] = useState(new Set)
    useEffect(function onMount(){
        const allOptions = Object.entries(data).flat();
        // for (let i = allOptions.length - 1; i > 0; i--) {
        //     let j = Math.floor(Math.random() * (i + 1));
        //     [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
        // }
        // setOptions(allOptions);
        setOptions(_.shuffle(allOptions))
    },[])

    const handleSelect = (e) => {
        const {target} = e;
        const value = target.getAttribute('data-value');

        //edge case
        if(selected.length === 2 || selected.includes(value)){
            return null;
        }

        //two turns 
        //first turn -> country/capital
        //button-color to blue
        //second turn -> country/capital4
        //button-color to blue

        const newSelected = selected.concat(value);
        if(newSelected.length === 2){
            const[first, second] = newSelected;
            if(data[first] === second || data[second] === first){
                setCorrect(newSelected)
                setTimeout(() => {
                    setMatched(new Set([...matched,...newSelected]));
                    setCorrect([]);
                    setSelected([]);
                }, 800)
            }else{
                setSelected(newSelected)
                setTimeout(() => {
                    setSelected([])
                }, 1000)
            }
        }else{
            setSelected(newSelected);
        }
    }

    if(matched.size === options.length){
        return <h1>You Win</h1>
    }

    return (
    <div className="game-board">
      {
          options.map(option => {
            if(matched.has(option)){
                return null;
            }
            

            const isSelected = selected.includes(option) || correct.includes(option);
            const isCorrect = correct.includes(option);
            const isIncorrect = selected.length === 2 && isSelected && !isCorrect;
            
            return <button className={classNames("option", isSelected && 'selected',
            isIncorrect && 'incorrect',
            isCorrect && 'correct')} key={option} onClick={handleSelect} data-value = {option}>{option}</button>
        })
      }
    </div>
  )
}

export default Game
