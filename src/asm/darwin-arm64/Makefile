test: asm-test
	./asm-test

asm-test: asm.o
	ld -o asm-test asm.o -lSystem -syslibroot `xcrun -sdk macosx --show-sdk-path`

asm.o: asm.spec.s
	as -o asm.o asm.spec.s

