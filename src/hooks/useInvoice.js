import { useState, useCallback } from 'react';
import { createInvoice, updateInvoice, getInvoice, deleteInvoice } from '../services/api';

export const useInvoice = (initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = useCallback((updates) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const save = useCallback(async (invoiceId = null) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (invoiceId) {
        response = await updateInvoice(invoiceId, data);
      } else {
        response = await createInvoice(data);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [data]);

  const fetch = useCallback(async (invoiceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInvoice(invoiceId);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (invoiceId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteInvoice(invoiceId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, updateData, save, fetch, remove, loading, error };
};
