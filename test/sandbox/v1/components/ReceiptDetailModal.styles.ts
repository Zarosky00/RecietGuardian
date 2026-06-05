import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch', // Stretches container card flush to both sides
    zIndex: 1000,
  },
  backdropBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCenterContainer: Platform.select({
    web: {
      // Handled entirely by responsive CSS in `.modal-content-anim`
    },
    default: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '80%',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      overflow: 'hidden',
      backgroundColor: 'transparent',
    }
  }) as any,
  modalCard: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    flexDirection: 'column',
    alignItems: 'center', // Centers content column on screen
  },
  modalContentMax: {
    width: '100%',
    maxWidth: 620,
    flex: 1,
    flexDirection: 'column',
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 12,
    marginTop: -8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTextCol: {
    flex: 1,
    gap: 4,
    paddingRight: 12,
  },
  topCategoryLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    opacity: 0.45,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circularBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      default: {}
    }) as any,
  },
  scrollBody: {
    flex: 1,
  },
  subCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabelTiny: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    opacity: 0.4,
  },
  largeAmountText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  settlementHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  settlementStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  settlementStatusBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  keyValList: {
    gap: 12,
  },
  keyValRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 10.5,
    opacity: 0.5,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  detailsGridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gridCardHalf: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    minHeight: 144,
  },
  gridCardTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    opacity: 0.4,
    marginBottom: 12,
  },
  gridItemsList: {
    gap: 10,
  },
  gridItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItemLabel: {
    fontSize: 10,
    opacity: 0.5,
  },
  gridItemValue: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hashValueText: {
    fontSize: 9.5,
    opacity: 0.55,
  },
  copyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {}
    }) as any,
  },
  copyBtnText: {
    fontSize: 8,
    fontWeight: '900',
  },
  documentPreviewBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  docIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docFileName: {
    fontSize: 10.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  docFileSize: {
    fontSize: 9,
    opacity: 0.5,
    fontFamily: 'Share Tech Mono, monospace',
  },
  footerBlock: {
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  footerInlineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  keepActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      default: {}
    }) as any,
  },
  keepActionText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  returnedActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      default: {}
    }) as any,
  },
  returnedActionText: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  deleteActionBtnWide: {
    height: 42,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
      default: {}
    }) as any,
  },
  deleteActionText: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
