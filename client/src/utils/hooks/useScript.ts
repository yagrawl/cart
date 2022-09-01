import { useEffect } from 'react';

interface attribute {
    key: string,
    value: string,
}

const useScript = (url: string, id: string, type: string, attributes: attribute[]) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.id = id;
    script.type = type;
    script.async = true;
    
    attributes.forEach(attribute => {
        script.setAttribute(attribute.key, attribute.value);
    })

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url, id, type, attributes]);
};

export default useScript;