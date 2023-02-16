test:  aout
	./aout

aout: source.o
	ld -o aout source.o -lSystem -syslibroot `xcrun -sdk macosx --show-sdk-path`

source.o: source.s 
	as -o source.o source.s

source.s: source.eg
	node compile.js
