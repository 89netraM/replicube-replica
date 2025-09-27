(module
  (func (export "render") (param i32 i32 i32) (result i32)
    i32.const 0
    local.get 0
    local.get 2
    i32.add
    i32.const 8
    i32.add
    local.get 1
    select))
