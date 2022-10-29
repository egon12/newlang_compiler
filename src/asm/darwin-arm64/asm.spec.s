.global _main
.align 2
.extern _printf

_main:
	bl main.main
	mov x16, #1
	svc 0x80
main.main:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, x29, #16
	mov x0, #4
	bl main.plusOne
	mov x0, x0
	str x0, [x29, #-8]
	ldr x0, [x29, #-8]
	bl printint
	mov x0, x0
	bl println
	mov x0, x0
	mov x0, #0
	ldp x29, x30, [sp, #16]
	add sp, sp, #16
	ret
main.plusOne:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, x29, #16
	str x0, [x29, #-8]
	mov x0, #1
	ldr x1, [x29, #-8]
	add x0, x0, x1
	ldp x29, x30, [sp, #16]
	add sp, sp, #16
	ret
main.add:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, x29, #16
	str x0, [x29, #-8]
	str x1, [x29, #-16]
	ldr x0, [x29, #-8]
	ldr x1, [x29, #-16]
	add x0, x0, x1
	ldp x29, x30, [sp, #16]
	add sp, sp, #16
	ret

printint:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, sp, #16
	str x0, [sp, #0]
	adrp x0, intStr@page
	add x0, x0, intStr@pageoff
	bl _printf
	ldp x29, x30, [sp, #16]
	add sp, sp, #16
	ret

println:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, sp, #16
	adrp x0, lnstr@page
	add x0, x0, lnstr@pageoff
	bl _printf
	ldp x29, x30, [sp, #16]
	add sp, sp, #16
	ret


.data
lnstr: .asciz "\n"
intStr: .asciz "%d"
	