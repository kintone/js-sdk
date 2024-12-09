# Functions Must Return an Object (`return-object`)

Enforce functions to return an object.

#### ❌Incorrect

```typescript
const func = (): string => {
  /* ... */
};
```

#### ✅Correct

```typescript
const func = (): { value: string } => {
  /* ... */
};
```
