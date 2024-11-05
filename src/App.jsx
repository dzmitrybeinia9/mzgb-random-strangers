import { useState } from 'react'
import BasicTable from './components/BasicTable'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns';

function App() {
  const { isError, isLoading, data: response, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['repoData'],
  });
  const formattedDate = format(new Date(dataUpdatedAt), 'dd.MM.yyyy HH:mm:ss');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !response) {
    return <div>Error</div>;
  }

  return (
    <div class="w-ful p-3">
      <BasicTable response={response} date={formattedDate} refetch={refetch}/>
    </div>
  )
}

export default App
