
'use client'
import { useMemo } from 'react';
import { CheckboxGroup } from '@douyinfe/semi-ui';
import { CapabilityTerms } from '@/utils/constants'

export default function StepTwo({ capabilityTerms, setCapabilityTerms }: { capabilityTerms: any, setCapabilityTerms: any }) {
  
  const defaultValues = useMemo(() => {
    return capabilityTerms.map((item: any) => item.value)
  },[capabilityTerms])

  const handleSelect = (vals: any[]) => {
    
    const selected = CapabilityTerms.filter((item) => vals.includes(item.value))
    console.log('selected', selected)
    setCapabilityTerms(selected)
  }
  
  return (
    <div>
      <CheckboxGroup options={CapabilityTerms} defaultValue={defaultValues} onChange={(vals) =>handleSelect(vals)} />
    </div>
  )
}