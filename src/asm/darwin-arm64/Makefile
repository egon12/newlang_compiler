test: asm-test
	./asm-test

asm-test: asm.o
	ld -o asm-test asm.o -lSystem -syslibroot `xcrun -sdk macosx --show-sdk-path`

asm.o: asm.spec.s
	as -o asm.o asm.spec.s


literal: literal-test
	./literal-test

literal-test: literal.o
	ld -o literal-test literal.o -lSystem -syslibroot `xcrun -sdk macosx --show-sdk-path`

literal.o: literal_asm.spec.s
	as -o literal.o literal_asm.spec.s


condition: condition-test
	./condition-test

condition-test: condition.o
	ld -o condition-test condition.o -lSystem -syslibroot `xcrun -sdk macosx --show-sdk-path`

condition.o: condition.spec.s
	as -o condition.o condition.spec.s
