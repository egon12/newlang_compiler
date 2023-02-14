.global _main
.align 2
.extern _printf

_main:
	bl main.main
	mov x16, #1
	svc 0x80
main.main:
	sub sp, sp, #64
	stp x29, x30, [sp, #64]
	add x29, x29, #64
	mov x0, #1
	str x0, [x29, #-8]
	mov x0, #2
	str x0, [x29, #-16]
	mov x0, #1
	str x0, [x29, #-24]
	mov x0, #70
	str x0, [x29, #-32]
	ldr x0, [x29, #-8]
	ldr x1, [x29, #-32]
	bl undefined.countA
	mov x0, x0
	str x0, [x29, #-40]
	ldr x0, [x29, #-16]
	ldr x1, [x29, #-32]
	bl undefined.countB
	mov x0, x0
	str x0, [x29, #-48]
	ldr x0, [x29, #-24]
	ldr x1, [x29, #-32]
	bl undefined.countC
	mov x0, x0
	str x0, [x29, #-56]
undefinedundefined	add x0, x0, x1
undefined	add x0, x0, x1
	str x0, [x29, #-64]
	ldp x29, x30, [sp, #64]
	add sp, sp, #64
	ret
main.countA:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, x29, #16
	str x0, [x29, #-8]
	str x1, [x29, #-16]
undefined	ldp x29, x30, [sp, #16]
	add sp, sp, #16
	ret
main.countB:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, x29, #16
	str x0, [x29, #-8]
	str x1, [x29, #-16]
undefined	ldp x29, x30, [sp, #16]
	add sp, sp, #16
	ret
main.countC:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, x29, #16
	str x0, [x29, #-8]
	str x1, [x29, #-16]
	ldr x0, [x29, #-8]
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
	