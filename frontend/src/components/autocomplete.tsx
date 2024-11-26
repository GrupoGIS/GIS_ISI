import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  FormEvent,
  KeyboardEvent,
} from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

import { Input } from '@/components/ui/input'

interface Props {
  className?: string
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}

export const Autocomplete: React.FC<Props> = ({ className, onPlaceSelect }) => {
  const places = useMapsLibrary('places')

  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>()

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null)

  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null)

  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([])

  const [inputValue, setInputValue] = useState<string>('')

  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1)

  // Ref for the PlacesService
  const placesServiceRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!places) return

    setAutocompleteService(new places.AutocompleteService())
    setSessionToken(new places.AutocompleteSessionToken())

    // Initialize PlacesService without a map by using an HTMLDivElement
    if (placesServiceRef.current) {
      setPlacesService(new places.PlacesService(placesServiceRef.current))
    } else {
      // Create a div if it doesn't exist
      const div = document.createElement('div')
      placesServiceRef.current = div
      setPlacesService(new places.PlacesService(div))
    }

    return () => setAutocompleteService(null)
  }, [places])

  const fetchPredictions = useCallback(
    (inputValue: string) => {
      if (!autocompleteService || !inputValue) {
        setPredictionResults([])
        return
      }

      const request: google.maps.places.AutocompleteRequest = {
        input: inputValue,
        sessionToken,
        language: 'pt-BR',
      }

      autocompleteService.getPlacePredictions(
        request,
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictionResults(predictions)
          } else {
            setPredictionResults([])
          }
        }
      )
    },
    [autocompleteService, sessionToken]
  )

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement)?.value

    setInputValue(value)
    setActiveSuggestion(-1)
    fetchPredictions(value)
  }

  const handleSuggestionSelect = useCallback(
    (placeId: string) => {
      if (!places || !placesService) return

      const detailRequestOptions: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: ['address_components', 'formatted_address', 'geometry'],
        sessionToken,
      }

      placesService.getDetails(detailRequestOptions, (placeDetails, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          placeDetails
        ) {
          console.log(placeDetails)
          onPlaceSelect(placeDetails)
          setPredictionResults([])
          setInputValue(placeDetails.formatted_address ?? '')
          setSessionToken(new places.AutocompleteSessionToken())
        }
      })
    },
    [onPlaceSelect, places, placesService, sessionToken]
  )

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion((prev) =>
        prev < predictionResults.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (
        activeSuggestion >= 0 &&
        activeSuggestion < predictionResults.length
      ) {
        const selectedPrediction = predictionResults[activeSuggestion]
        handleSuggestionSelect(selectedPrediction.place_id)
      }
    }
  }

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
        onKeyDown={onInputKeyDown}
        className={className}
      />

      {predictionResults.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-2 max-h-60 overflow-auto shadow-md">
          {predictionResults.map(({ place_id, description }, index) => {
            return (
              <li
                key={place_id}
                className={`p-2 cursor-pointer ${
                  index === activeSuggestion
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
                onMouseDown={() => handleSuggestionSelect(place_id)}
              >
                {description}
              </li>
            )
          })}
        </ul>
      )}

      {/* Hidden div for PlacesService */}
      <div ref={placesServiceRef} style={{ display: 'none' }} />
    </div>
  )
}
