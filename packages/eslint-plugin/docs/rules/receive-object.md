# Functions Must Receive an Object (`receive-object`)

Enforce functions to receive only a single object.

#### ❌Incorrect

```typescript
const func = (param1: string, param2: string) => {
  /* ... */
};
```

#### ✅Correct

```typescript
const func = (params: { param1: string; param2: string }) => {
  /* ... */
};
```
