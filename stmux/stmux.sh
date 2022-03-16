#!/bin/sh

echo tmux sessions:

# list tmux sessions and add line num as prefix
tmux ls | awk '{print NR") "$0}'

# store first column val into array as choices
choices=($(tmux ls | awk -F ":" '{print $1}'))

echo select session you want to attach: \\c
read index
r_idx=`expr $index - 1`     # index -1. transfer to real array index
choice=${choices[$r_idx]}   # take session name from choices array
echo attach to session $choice...

# attach to the tmux session which user selected
tmux a -t $choice

