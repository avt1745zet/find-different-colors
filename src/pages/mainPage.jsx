import React, {Fragment, useRef, useState} from 'react';
import {Box} from '@mui/system';
import {Typography} from '@mui/material';

const MainPage = () => {
  return (
    <Fragment>
      <Box component='header'>
        <Typography variant='h5' align='center'>
            Find Different Colors
        </Typography>
      </Box>
      <Box
        component='main'
        sx={{
          height: '100%',
        }}
      >
        <Game/>
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

const Game = () => {
  const gameFrameRef = useRef(null);
  const squareRef = useRef(null);

  window.addEventListener('resize', ()=>{
    const size = Math.min(
        gameFrameRef.current.offsetWidth,
        gameFrameRef.current.offsetHeight );
    squareRef.current.style.width = size + 'px';
    squareRef.current.style.height = size+ 'px';
  });
  window.addEventListener('load', ()=>{
    const size = Math.min(
        gameFrameRef.current.offsetWidth,
        gameFrameRef.current.offsetHeight );
    squareRef.current.style.width = size + 'px';
    squareRef.current.style.height = size+ 'px';
  });

  const [level, setLevel] = useState(1);

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

  const handleBlockClick = ( position ) => {
    if (position[0] === answerPosition[0] &&
        position[1] === answerPosition[1]) {
      setLevel(level+1);
    }
  };

  for ( let i = 0; i < size[0]; i++) {
    const clomns = [];
    for ( let j = 0; j < size[1]; j++) {
      const color = i === answerPosition[0] && j === answerPosition[1]?
      answerColor: questionColor;
      const block = (
        <Box
          onClick={()=>handleBlockClick([i, j])}
          key={ j.toString()}
          sx={{
            height: '100%',
            width: `${100/(level + 1)}%`,
            backgroundColor: `rgb(
            ${color.r},
            ${color.g},
            ${color.b})`,
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
        </Box>
      );
      clomns.push(block);
    }
    rows.push(
        <Box
          key={ i.toString()}
          sx={{height: `${100/(level + 1)}%`}}
        >
          {clomns}
        </Box>,
    );
  }
  return (
    <Box
      ref={gameFrameRef}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box ref={squareRef} >
        {rows}
      </Box>
    </Box>
  );
};
