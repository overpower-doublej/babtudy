default:
	git pull
	$(MAKE) -C server
	make listen

listen:
	forever restartall
