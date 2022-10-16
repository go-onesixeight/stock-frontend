import { useEffect, useRef, useState } from "react";

const useEffectOnces = (effect: any) => {
  const effectFn = useRef(effect);
  const destroyFn: any = useRef();
  const effectCalled = useRef(false);
  const rendered = useRef(false);
  const [, refresh] = useState(0);

  if (effectCalled.current) {
    rendered.current = true;
  }

  useEffect(() => {
    if (!effectCalled.current) {
      destroyFn.current = effectFn.current();
      effectCalled.current = true;
    }

    refresh(1);

    return () => {
      if (rendered.current === false) return;
      if (destroyFn.current) destroyFn.current();
    };
  }, []);
};

const useEffectOnce = (_effect: any) => {
  const effect = useRef(_effect);
  const destroy: any = useRef();
  const effectCalled = useRef(false);
  const rendered = useRef(false);
  if (effectCalled.current) {
    rendered.current = true;
  }
  useEffect(() => {
    if (!effectCalled.current) {
      destroy.current = effect.current();
      effectCalled.current = true;
    }
    return () => {
      if (rendered.current === false) return;
      if (destroy.current) destroy.current();
    };
  }, []);
};

export { useEffectOnce, useEffectOnces };
