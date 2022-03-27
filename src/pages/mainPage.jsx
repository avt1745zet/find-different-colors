import React, {Fragment, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/system';
import {Typography} from '@mui/material';

const MainPage = ()=>{
  const mainElement = useRef(null);
  const [width, setWidth] = useState('10px');
  window.addEventListener('resize', ()=>{
    const size = Math.min(
        mainElement.current.offsetWidth,
        mainElement.current.offsetHeight );
    setWidth(size + 'px');
  });
  window.addEventListener('load', ()=>{
    const size = Math.min(
        mainElement.current.offsetWidth,
        mainElement.current.offsetHeight );
    setWidth(size + 'px');
  });

  const [level, setLevel]= useState(1);

  return (
    <Fragment>
      <Box component='header'>
        <Typography variant='h5' align='center'>
            Find Different Colors
        </Typography>
      </Box>
      <Box
        component='main'
        ref={mainElement}
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Game
          level = {level}
          onAnswerClick={()=>{
            const nextLevel = level + 1;
            setLevel(nextLevel);
          }}
          sx={{
            width: width,
            height: width,
          }}/>
      </Box>
      <Box component='footer'>
        <Typography variant='h5' align='center'>
            Footer
        </Typography>
      </Box>
    </Fragment>
  );
};

export default MainPage;

const Game = ( props ) => {
  const {level, onAnswerClick, ...other} = props;
  const rows = [];

  const questionColor = {
    r: Math.random() * 255,
    g: Math.random() * 255,
    b: Math.random() * 255,
  };
  const answerColor = {
    r: questionColor.r + Math.random() * 255 / level,
    g: questionColor.g + Math.random() * 255 / level,
    b: questionColor.b + Math.random() * 255 / level,
  };
  const size = [level + 1, level + 1];
  const answerPosition = [
    Math.floor(Math.random()*size[0]),
    Math.floor(Math.random()*size[1]),
  ];

  for ( let i = 0; i < size[0]; i++) {
    const clomns = [];
    for ( let j = 0; j < size[1]; j++) {
      const color = i === answerPosition[0] && j === answerPosition[1]?
      answerColor: questionColor;
      const block = (
        <Box
          onClick={()=>{
            if (i === answerPosition[0] && j === answerPosition[1]) {
              onAnswerClick();
            }
          }}
          key={ j.toString()}
          sx={{
            height: '100%',
            width: `${100/(level + 1)}%`,
            backgroundColor: `rgb(
          ${color.r},
          ${color.g},
          ${color.b})`,
            display: 'inline-block',
          }}>
        </Box>
      );
      clomns.push(block);
    }
    rows.push(
        <Box
          key={ i.toString()}
          sx={{height: `${100/(level + 1)}%`}}>
          {clomns}
        </Box>,
    );
  }
  return (
    <Box
      {...other}
    >
      {rows}
    </Box>
  );
};

Game.propTypes = {
  level: PropTypes.number.isRequired,
  onAnswerClick: PropTypes.func.isRequired,
};
